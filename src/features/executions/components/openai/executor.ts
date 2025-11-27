import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import { OPENAI_AVAILABLE_MODELS } from "@/features/executions/constants/openai";
import prisma from "@/lib/database";
import { CredentialType } from "@/generated/prisma/enums";

type OpenAIModel = (typeof OPENAI_AVAILABLE_MODELS)[number];

export type OpenAiData = {
  model: OpenAIModel;
  credentialId: string;
  userPrompt: string;
  systemPrompt?: string;
  variableName: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
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

    if (!data.credentialId) {
      await publishStatus("error");
      throw new NonRetriableError("OpenAI Node: Credential is missing.");
    }

    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError("OpenAI Node: Variable name is missing.");
    }

    if (!data.userPrompt) {
      await publishStatus("error");
      throw new NonRetriableError("OpenAI Node: User prompt is missing.");
    }

    const system = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";

    const prompt = Handlebars.compile(data.userPrompt)(context);

    const userCredential = await step.run(
      "openai-fetch-credential",
      async () => {
        return await prisma.credential.findUnique({
          where: { id: data.credentialId },
        });
      }
    );

    if (!userCredential || userCredential.type !== CredentialType.OPENAI) {
      await publishStatus("error");
      throw new NonRetriableError("OpenAI Node: Invalid OpenAI API Credential.");
    }

    // Create OpenAI instance using user credential
    const openAI = createOpenAI({ apiKey: userCredential.value });

    // Generate text
    const result = await step.ai.wrap("openai-generate-text", generateText, {
      model: openAI(data.model),
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
    if (firstStep && Array.isArray(firstStep.content) && firstStep.content[0]?.type === "text") {
      text = firstStep.content[0].text;
    }

    await publishStatus("success");

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
