import { GoogleGenAI } from "@google/genai";
import { randomUUID } from "node:crypto";

type ImageProviderId = "gemini" | "openai";
type ImageAspect = "auto" | "1024x1024" | "1536x1024" | "1024x1536";
type ImageQuality = "auto" | "low" | "medium" | "high";

type ImageProviderErrorCode =
  | "missing_api_key"
  | "bad_request"
  | "auth"
  | "rate_limited"
  | "moderation"
  | "no_image"
  | "network"
  | "method_not_allowed"
  | "upstream"
  | "unknown";

interface ImageProxyRequest {
  provider: ImageProviderId;
  prompt: string;
  imageBase64: string;
  mimeType: string;
  model?: string;
  aspect: ImageAspect;
  quality: ImageQuality;
}

interface ImageUsage {
  inputTokens?: number;
  imageInputTokens?: number;
  textInputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

interface ImageProxyResult {
  dataUrl: string;
  latencyMs: number;
  usage?: ImageUsage;
  provider: ImageProviderId;
  model: string;
  debugPrompt: string;
}

interface OpenAIImagesResponse {
  data?: Array<{
    b64_json?: string;
  }>;
  usage?: {
    input_tokens?: number;
    input_tokens_details?: {
      image_tokens?: number;
      text_tokens?: number;
    };
    output_tokens?: number;
    total_tokens?: number;
  };
}

interface OpenAIErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string | null;
    param?: string | null;
  };
}

const OPENAI_MODEL = "gpt-image-2";
const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const IMAGE_ASPECT_VALUES = ["auto", "1024x1024", "1536x1024", "1024x1536"] as const;
const IMAGE_QUALITY_VALUES = ["auto", "low", "medium", "high"] as const;
const OPENAI_SUPPORTED_INPUT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
const OPENAI_MAX_ATTEMPTS = 2;
const OPENAI_RETRY_BASE_DELAY_MS = 1000;
let didLogGeminiAspectQualityWarning = false;

const sendJson = (res: any, status: number, payload: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const sendProviderError = (
  res: any,
  status: number,
  provider: ImageProviderId | "unknown",
  code: ImageProviderErrorCode,
  message: string
) => {
  sendJson(res, status, {
    error: {
      provider,
      code,
      message,
      status,
    },
  });
};

const readJsonBody = async (req: any): Promise<unknown> => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
};

const normalizeBase64 = (value: string): string => {
  const commaIndex = value.indexOf(",");
  return commaIndex >= 0 ? value.slice(commaIndex + 1) : value;
};

const badRequest = (
  message: string,
  provider: ImageProviderId | "unknown" = "unknown"
) => ({
  status: 400,
  provider,
  code: "bad_request" as const,
  message,
});

const parseEnumValue = <T extends readonly string[]>(
  value: unknown,
  allowedValues: T,
  fallback: T[number],
  fieldName: string,
  provider: ImageProviderId | "unknown"
): T[number] => {
  if (value === undefined) return fallback;

  if (typeof value !== "string" || !allowedValues.includes(value)) {
    throw badRequest(
      `${fieldName} must be one of: ${allowedValues.join(", ")}.`,
      provider
    );
  }

  return value as T[number];
};

const validateRequest = (body: unknown): ImageProxyRequest => {
  if (!body || typeof body !== "object") {
    throw badRequest("Request body must be a JSON object.");
  }

  const candidate = body as Partial<ImageProxyRequest>;
  if (candidate.provider !== "gemini" && candidate.provider !== "openai") {
    throw badRequest("provider must be either 'gemini' or 'openai'.");
  }

  if (!candidate.prompt || typeof candidate.prompt !== "string") {
    throw badRequest("prompt is required.", candidate.provider);
  }

  if (!candidate.imageBase64 || typeof candidate.imageBase64 !== "string") {
    throw badRequest("imageBase64 is required.", candidate.provider);
  }

  if (!candidate.mimeType || typeof candidate.mimeType !== "string") {
    throw badRequest("mimeType is required.", candidate.provider);
  }

  return {
    provider: candidate.provider,
    prompt: candidate.prompt,
    imageBase64: normalizeBase64(candidate.imageBase64),
    mimeType: candidate.mimeType,
    model: candidate.model,
    aspect: parseEnumValue(candidate.aspect, IMAGE_ASPECT_VALUES, "auto", "aspect", candidate.provider),
    quality: parseEnumValue(candidate.quality, IMAGE_QUALITY_VALUES, "medium", "quality", candidate.provider),
  };
};

const errorCodeForStatus = (status: number): ImageProviderErrorCode => {
  if (status === 400) return "bad_request";
  if (status === 401 || status === 403) return "auth";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "upstream";
  return "unknown";
};

const messageForOpenAIError = (status: number, fallback?: string): string => {
  if (status === 400) return fallback || "OpenAI rejected the image generation request.";
  if (status === 401) return "OpenAI authentication failed. Check OPENAI_API_KEY.";
  if (status === 403) return "OpenAI organization or project access failed. Confirm GPT Image access and organization verification.";
  if (status === 429) return "OpenAI image generation is rate limited. Please try again later.";
  if (status >= 500) return "OpenAI upstream server error. Please retry; check function logs for the OpenAI request ID.";
  return fallback || "OpenAI image generation failed.";
};

const toImageUsage = (usage: OpenAIImagesResponse["usage"]): ImageUsage | undefined => {
  if (!usage) return undefined;

  return {
    inputTokens: usage.input_tokens,
    imageInputTokens: usage.input_tokens_details?.image_tokens,
    textInputTokens: usage.input_tokens_details?.text_tokens,
    outputTokens: usage.output_tokens,
    totalTokens: usage.total_tokens,
  };
};

const modelForProvider = (provider: ImageProviderId): string => {
  return provider === "openai" ? OPENAI_MODEL : GEMINI_MODEL;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableOpenAIStatus = (status: number): boolean => {
  return status === 408 || status === 500 || status === 502 || status === 503 || status === 504;
};

const filenameForMimeType = (mimeType: string): string => {
  switch (mimeType) {
    case "image/jpeg":
      return "source-image.jpg";
    case "image/webp":
      return "source-image.webp";
    case "image/png":
    default:
      return "source-image.png";
  }
};

const validateOpenAIInputImage = (request: ImageProxyRequest) => {
  if (!OPENAI_SUPPORTED_INPUT_MIME_TYPES.includes(request.mimeType as any)) {
    throw {
      status: 400,
      provider: "openai",
      code: "bad_request",
      message:
        "OpenAI image edits support PNG, JPEG, or WebP input images. Convert the source image and try again.",
    };
  }
};

const readOpenAIResponse = async (
  response: Response
): Promise<{ payload: OpenAIImagesResponse & OpenAIErrorResponse; rawText: string }> => {
  const rawText = await response.text();
  if (!rawText) {
    return { payload: {}, rawText: "" };
  }

  try {
    return {
      payload: JSON.parse(rawText) as OpenAIImagesResponse & OpenAIErrorResponse,
      rawText,
    };
  } catch {
    return { payload: {}, rawText };
  }
};

const getOpenAIErrorFields = (payload: OpenAIErrorResponse, rawText: string) => {
  const upstreamMessage =
    typeof payload?.error?.message === "string" ? payload.error.message : undefined;
  const upstreamType =
    typeof payload?.error?.type === "string" ? payload.error.type : undefined;
  const upstreamCode =
    typeof payload?.error?.code === "string" ? payload.error.code : undefined;
  const upstreamParam =
    typeof payload?.error?.param === "string" ? payload.error.param : undefined;

  return {
    message: upstreamMessage || rawText.slice(0, 500) || undefined,
    type: upstreamType,
    code: upstreamCode,
    param: upstreamParam,
  };
};

const generateWithOpenAI = async (request: ImageProxyRequest): Promise<ImageProxyResult> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw {
      status: 500,
      provider: "openai",
      code: "missing_api_key",
      message: "OPENAI_API_KEY is not configured on the server.",
    };
  }

  validateOpenAIInputImage(request);

  const imageBytes = Buffer.from(request.imageBase64, "base64");
  const imageBlob = new Blob([imageBytes], { type: request.mimeType });
  const form = new FormData();
  form.append("model", OPENAI_MODEL);
  form.append("image[]", imageBlob, filenameForMimeType(request.mimeType));
  form.append("prompt", request.prompt);
  form.append("output_format", "png");
  form.append("quality", request.quality);
  form.append("size", request.aspect);

  const clientRequestId = `lenslab-${randomUUID()}`;
  let response: Response | undefined;
  let payload: OpenAIImagesResponse & OpenAIErrorResponse = {};
  let rawText = "";

  for (let attempt = 1; attempt <= OPENAI_MAX_ATTEMPTS; attempt += 1) {
    try {
      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "X-Client-Request-Id": clientRequestId,
        },
        body: form,
      });
    } catch (error) {
      console.error("[image-proxy] openai fetch failed:", {
        model: OPENAI_MODEL,
        attempt,
        maxAttempts: OPENAI_MAX_ATTEMPTS,
        clientRequestId,
        message: error instanceof Error ? error.message : String(error),
      });

      if (attempt < OPENAI_MAX_ATTEMPTS) {
        await sleep(OPENAI_RETRY_BASE_DELAY_MS * attempt);
        continue;
      }

      throw {
        status: 502,
        provider: "openai",
        code: "upstream",
        message: "OpenAI image generation request failed before a response was received.",
      };
    }

    const parsed = await readOpenAIResponse(response);
    payload = parsed.payload;
    rawText = parsed.rawText;

    if (response.ok || !isRetryableOpenAIStatus(response.status) || attempt === OPENAI_MAX_ATTEMPTS) {
      break;
    }

    const requestId = response.headers.get("x-request-id") || undefined;
    const upstream = getOpenAIErrorFields(payload, rawText);
    console.warn("[image-proxy] retrying openai image edit:", {
      model: OPENAI_MODEL,
      status: response.status,
      attempt,
      maxAttempts: OPENAI_MAX_ATTEMPTS,
      openaiRequestId: requestId,
      clientRequestId,
      errorType: upstream.type,
      errorCode: upstream.code,
      errorParam: upstream.param,
      errorMessage: upstream.message,
    });

    await sleep(OPENAI_RETRY_BASE_DELAY_MS * attempt);
  }

  if (!response) {
    throw {
      status: 502,
      provider: "openai",
      code: "upstream",
      message: "OpenAI image generation request failed before a response was received.",
    };
  }

  if (!response.ok) {
    const requestId = response.headers.get("x-request-id") || undefined;
    const upstream = getOpenAIErrorFields(payload, rawText);
    const isModeration =
      [upstream.code, upstream.type, upstream.message]
        .filter(Boolean)
        .some((value) => value!.includes("moderation") || value!.includes("content"));

    console.error("[image-proxy] openai image edit failed:", {
      model: OPENAI_MODEL,
      status: response.status,
      openaiRequestId: requestId,
      clientRequestId,
      errorType: upstream.type,
      errorCode: upstream.code,
      errorParam: upstream.param,
      errorMessage: upstream.message,
      size: request.aspect,
      quality: request.quality,
      outputFormat: "png",
      mimeType: request.mimeType,
      imageBytes: imageBytes.byteLength,
    });

    throw {
      status: response.status >= 500 ? 502 : response.status,
      provider: "openai",
      code: isModeration ? "moderation" : errorCodeForStatus(response.status),
      message: isModeration
        ? upstream.message || "OpenAI blocked this request under image safety policy."
        : messageForOpenAIError(response.status, upstream.message),
    };
  }

  const imageBase64 = payload.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw {
      status: 502,
      provider: "openai",
      code: "upstream",
      message: "OpenAI did not return an image.",
    };
  }

  return {
    dataUrl: `data:image/png;base64,${imageBase64}`,
    latencyMs: 0,
    usage: toImageUsage(payload.usage),
    provider: "openai",
    model: OPENAI_MODEL,
    debugPrompt: request.prompt.slice(0, 2000),
  };
};

const generateWithGemini = async (request: ImageProxyRequest): Promise<ImageProxyResult> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw {
      status: 500,
      provider: "gemini",
      code: "missing_api_key",
      message: "GEMINI_API_KEY is not configured on the server.",
    };
  }

  if (!didLogGeminiAspectQualityWarning) {
    console.warn("[image-proxy] warning: gemini path ignores aspect/quality");
    didLogGeminiAspectQualityWarning = true;
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: {
      parts: [
        {
          inlineData: {
            data: request.imageBase64,
            mimeType: request.mimeType,
          },
        },
        { text: request.prompt },
      ],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData);
  if (!imagePart?.inlineData?.data) {
    throw {
      status: 502,
      provider: "gemini",
      code: "no_image",
      message: "Gemini did not return an image.",
    };
  }

  return {
    dataUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
    latencyMs: 0,
    provider: "gemini",
    model: GEMINI_MODEL,
    debugPrompt: request.prompt.slice(0, 2000),
  };
};

const normalizeThrownError = (
  error: any,
  provider: ImageProviderId | "unknown"
): { status: number; provider: ImageProviderId | "unknown"; code: ImageProviderErrorCode; message: string } => {
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    return {
      status: typeof error.status === "number" ? error.status : 500,
      provider: error.provider || provider,
      code: error.code,
      message: error.message,
    };
  }

  const status = typeof error?.status === "number" ? error.status : 500;
  return {
    status,
    provider,
    code: errorCodeForStatus(status),
    message: error?.message || "Image generation failed.",
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendProviderError(res, 405, "unknown", "method_not_allowed", "Only POST is supported.");
    return;
  }

  let provider: ImageProviderId | "unknown" = "unknown";
  const startedAt = Date.now();

  try {
    let body: unknown;
    try {
      body = await readJsonBody(req);
    } catch {
      throw badRequest("Request body must be valid JSON.");
    }

    const request = validateRequest(body);
    provider = request.provider;
    const model = modelForProvider(request.provider);

    console.log("[image-proxy] request:", {
      provider: request.provider,
      model,
    });
    console.log("[image-proxy] prompt:", request.prompt.slice(0, 2000));

    const result =
      request.provider === "openai"
        ? await generateWithOpenAI(request)
        : await generateWithGemini(request);
    const latencyMs = Date.now() - startedAt;

    console.log("[image-proxy] completed:", {
      provider: request.provider,
      model,
      latencyMs,
    });

    sendJson(res, 200, {
      ...result,
      latencyMs,
    });
  } catch (error: any) {
    const normalized = normalizeThrownError(error, provider);
    sendProviderError(
      res,
      normalized.status,
      normalized.provider,
      normalized.code,
      normalized.message
    );
  }
}
