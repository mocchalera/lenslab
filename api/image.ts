import { GoogleGenAI } from "@google/genai";

type ImageProviderId = "gemini" | "openai";

type ImageProviderErrorCode =
  | "missing_api_key"
  | "bad_request"
  | "auth"
  | "rate_limited"
  | "moderation"
  | "no_image"
  | "network"
  | "method_not_allowed"
  | "unknown";

interface ImageProxyRequest {
  provider: ImageProviderId;
  prompt: string;
  imageBase64: string;
  mimeType: string;
  model?: string;
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

const OPENAI_MODEL = "gpt-image-2";
const GEMINI_MODEL = "gemini-2.5-flash-image";

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
  };
};

const errorCodeForStatus = (status: number): ImageProviderErrorCode => {
  if (status === 400) return "bad_request";
  if (status === 401 || status === 403) return "auth";
  if (status === 429) return "rate_limited";
  return "unknown";
};

const messageForOpenAIError = (status: number, fallback?: string): string => {
  if (status === 400) return fallback || "OpenAI rejected the image generation request.";
  if (status === 401 || status === 403) return "OpenAI authentication or organization access failed.";
  if (status === 429) return "OpenAI image generation is rate limited. Please try again later.";
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

  const imageBytes = Buffer.from(request.imageBase64, "base64");
  const imageBlob = new Blob([imageBytes], { type: request.mimeType });
  const form = new FormData();
  form.append("model", OPENAI_MODEL);
  form.append("image[]", imageBlob, "source-image");
  form.append("prompt", request.prompt);
  form.append("output_format", "png");
  form.append("quality", "medium");
  form.append("size", "auto");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const responseJson = await response.json().catch(() => ({}));
  if (!response.ok) {
    const upstreamMessage =
      typeof responseJson?.error?.message === "string" ? responseJson.error.message : undefined;
    const upstreamCode =
      typeof responseJson?.error?.code === "string" ? responseJson.error.code : "";
    const isModeration = upstreamCode.includes("moderation") || upstreamCode.includes("content");

    throw {
      status: response.status,
      provider: "openai",
      code: isModeration ? "moderation" : errorCodeForStatus(response.status),
      message: isModeration
        ? upstreamMessage || "OpenAI blocked this request under image safety policy."
        : messageForOpenAIError(response.status, upstreamMessage),
    };
  }

  const payload = responseJson as OpenAIImagesResponse;
  const imageBase64 = payload.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw {
      status: 502,
      provider: "openai",
      code: "no_image",
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
