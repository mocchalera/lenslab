import { SimulationParams } from "../types";
import {
  generateSimulationWithProvider,
  ImageGenerationResult,
  ImageProvider,
} from "./imageProvider";

export const generateOpenAISimulation = async (
  imageFile: File,
  params: SimulationParams
): Promise<ImageGenerationResult> => {
  return generateSimulationWithProvider("openai", imageFile, params);
};

export const generateSimulation = async (
  imageFile: File,
  params: SimulationParams
): Promise<string> => {
  const result = await generateOpenAISimulation(imageFile, params);
  return result.dataUrl;
};

export const openAIProvider: ImageProvider = {
  id: "openai",
  label: "OpenAI",
  generateSimulation: generateOpenAISimulation,
};
