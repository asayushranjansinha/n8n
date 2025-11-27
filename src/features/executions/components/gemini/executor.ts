import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import { GEMINI_AVAILABLE_MODELS } from "@/features/executions/constants/gemini";

type GeminiModel = (typeof GEMINI_AVAILABLE_MODELS)[number];

export type GeminiData = {
  model: GeminiModel;
  userPrompt: string;
  systemPrompt?: string;
  variableName: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY as string;
const googleAI = createGoogleGenerativeAI({ apiKey: API_KEY });

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(geminiChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    const variableName = data.variableName;
    if (!variableName) {
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: Variable node is missing.");
    }

    if (!data.userPrompt) {
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: User prompt is missing.");
    }

    const system = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";

    const prompt = Handlebars.compile(data.userPrompt)(context);

    const result = await step.ai.wrap("gemini-generate-text", generateText, {
      model: googleAI(data.model),
      system,
      prompt,
      experimental_telemetry: {
        recordInputs: true,
        recordOutputs: true,
        isEnabled: true,
      },
    });

    const aiSteps = result.steps ?? [];
    let text = "";

    const firstStep = aiSteps[0];
    if (
      firstStep &&
      Array.isArray(firstStep.content) &&
      firstStep.content[0]?.type === "text"
    ) {
      text = firstStep.content[0].text;
    }

    await publishStatus("success");

    return {
      ...context,
      [variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
