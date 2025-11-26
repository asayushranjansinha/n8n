import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import { AVAILABLE_MODELS } from "./Dialog";

type OpenAIModel = (typeof AVAILABLE_MODELS)[number];

export type OpenAIData = {
  model: OpenAIModel;
  userPrompt: string;
  systemPrompt?: string;
  variableName: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

const API_KEY = process.env.OPENAI_API_KEY as string;
const openAIAI = createOpenAI({ apiKey: API_KEY });

export const openAIExecutor: NodeExecutor<OpenAIData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(openAiChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    const variableName = data.variableName;
    if (!variableName) {
      await publishStatus("error");
      throw new NonRetriableError("OpenAI Node: Variable node is missing.");
    }

    if (!data.userPrompt) {
      await publishStatus("error");
      throw new NonRetriableError("OpenAI Node: User prompt is missing.");
    }

    const system = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";

    const prompt = Handlebars.compile(data.userPrompt)(context);

    const result = await step.ai.wrap("openai-generate-text", generateText, {
      model: openAIAI(data.model),
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
