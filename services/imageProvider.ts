import { ImageAspect, ImageQuality, SimulationParams } from "../types";
import { buildSimulationPrompt } from "./simulationPrompt";

export type ImageProviderId = "gemini" | "openai";
export type OpenAIImageModel = "gpt-image-2";

export interface ImageUsage {
  inputTokens?: number;
  imageInputTokens?: number;
  textInputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface ImageProxyRequest {
  provider: ImageProviderId;
  prompt: string;
  imageBase64: string;
  mimeType: string;
  params?: SimulationParams;
  model?: OpenAIImageModel | string;
  aspect?: ImageAspect;
  quality?: ImageQuality;
}

export type ImageGenerationRequest = ImageProxyRequest;

export interface ImageGenerationResult {
  dataUrl: string;
  latencyMs: number;
  usage?: ImageUsage;
  provider?: ImageProviderId;
  model?: string;
  debugPrompt?: string;
}

export type ImageProviderErrorCode =
  | "missing_api_key"
  | "bad_request"
  | "auth"
  | "rate_limited"
  | "moderation"
  | "no_image"
  | "network"
  | "method_not_allowed"
  | "unknown";

export interface ImageProviderErrorPayload {
  error: {
    provider: ImageProviderId | "unknown";
    code: ImageProviderErrorCode;
    message: string;
    status: number;
  };
}

export class ImageProviderError extends Error {
  constructor(
    public readonly provider: ImageProviderId | "unknown",
    public readonly code: ImageProviderErrorCode,
    message: string,
    public readonly status: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ImageProviderError";
  }
}

export interface ImageProvider {
  id: ImageProviderId;
  label: string;
  generateSimulation(imageFile: File, params: SimulationParams): Promise<ImageGenerationResult>;
}

interface FileBase64Payload {
  imageBase64: string;
  mimeType: string;
}

const isErrorPayload = (value: unknown): value is ImageProviderErrorPayload => {
  if (!value || typeof value !== "object") return false;
  const maybePayload = value as Partial<ImageProviderErrorPayload>;
  return Boolean(maybePayload.error && typeof maybePayload.error.message === "string");
};

const errorCodeForStatus = (status: number): ImageProviderErrorCode => {
  if (status === 400) return "bad_request";
  if (status === 401 || status === 403) return "auth";
  if (status === 405) return "method_not_allowed";
  if (status === 429) return "rate_limited";
  return "unknown";
};

export const fileToBase64Payload = async (file: File): Promise<FileBase64Payload> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unable to read image file."));
        return;
      }

      const imageBase64 = result.split(",")[1];
      if (!imageBase64) {
        reject(new Error("Unable to encode image file."));
        return;
      }

      resolve({
        imageBase64,
        mimeType: file.type || "image/png",
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const requestImageGeneration = async (
  request: ImageGenerationRequest
): Promise<ImageGenerationResult> => {
  let payload: unknown = null;
  let response: Response;

  try {
    response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  } catch (error) {
    throw new ImageProviderError(
      request.provider,
      "network",
      "Unable to reach the image generation proxy.",
      0,
      error
    );
  }

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (isErrorPayload(payload)) {
      throw new ImageProviderError(
        payload.error.provider,
        payload.error.code,
        payload.error.message,
        payload.error.status,
        payload
      );
    }

    throw new ImageProviderError(
      request.provider,
      errorCodeForStatus(response.status),
      "Image generation failed.",
      response.status,
      payload
    );
  }

  const result = payload as Partial<ImageGenerationResult> | null;
  if (!result?.dataUrl) {
    throw new ImageProviderError(
      request.provider,
      "no_image",
      "The image generation proxy returned no image.",
      response.status,
      payload
    );
  }

  return {
    dataUrl: result.dataUrl,
    latencyMs: result.latencyMs ?? 0,
    usage: result.usage,
    provider: result.provider ?? request.provider,
    model: result.model,
    debugPrompt: result.debugPrompt,
  };
};

export const generateSimulationWithProvider = async (
  provider: ImageProviderId,
  imageFile: File,
  params: SimulationParams
): Promise<ImageGenerationResult> => {
  const { imageBase64, mimeType } = await fileToBase64Payload(imageFile);
  const prompt = buildSimulationPrompt(params);

  return requestImageGeneration({
    provider,
    prompt,
    imageBase64,
    mimeType,
    params,
    model: provider === "openai" ? "gpt-image-2" : undefined,
    aspect: params.aspect,
    quality: params.quality,
  });
};
