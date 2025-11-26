import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import { AVAILABLE_MODELS } from "./Dialog";

type GeminiModel = (typeof AVAILABLE_MODELS)[number];

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
  console.log("Executor started", { nodeId, data, context });

  const publishStatus = async (status: "loading" | "error" | "success") => {
    console.log("Publishing status", { nodeId, status });
    await publish(geminiChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    console.log("Validating input fields...");
    const variableName = data.variableName;
    if (!variableName) {
      console.log("Validation failed: variableName missing");
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: Variable node is missing.");
    }

    if (!data.userPrompt) {
      console.log("Validation failed: userPrompt missing");
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: User prompt is missing.");
    }

    console.log("Input validated", { variableName });

    console.log("Compiling system prompt...");
    const system = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";
    console.log("System prompt compiled", { system });

    console.log("Compiling user prompt...");
    const prompt = Handlebars.compile(data.userPrompt)(context);
    console.log("User prompt compiled", { prompt });

    console.log("Entering AI wrap step...");
    let aiSteps;
    try {
      const result = await step.ai.wrap("gemini-generate-text", generateText, {
        model: googleAI(data.model),
        system,
        prompt, // NOTE: Ky/TS overload needs "messages[]" if 'prompt' breaks
        experimental_telemetry: {
          recordInputs: true,
          recordOutputs: true,
          isEnabled: true,
        },
      });

      aiSteps = result.steps;
      console.log("AI wrap executed", { aiSteps });
    } catch (e: any) {
      console.log("AI wrap step crashed", {
        message: e.message,
        stack: e.stack,
      });
      throw e;
    }

    console.log("Extracting text from AI response...");
    const stepsArray = aiSteps ?? [];
    const firstStep = stepsArray[0];
    let text = "";

    if (
      firstStep &&
      Array.isArray(firstStep.content) &&
      firstStep.content[0] &&
      firstStep.content[0].type === "text"
    ) {
      text = firstStep.content[0].text;
      console.log("Text extracted", { text });
    } else {
      console.log("No text content found in AI step response");
    }

    await publishStatus("success");

    console.log("Executor completed successfully");

    return {
      ...context,
      [variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    console.log("Executor reached outer catch", { error });
    await publishStatus("error");
    throw error;
  }
};
