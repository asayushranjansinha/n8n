import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { ANTHROPIC_AVAILABLE_MODELS } from "@/features/executions/constants/anthropic";
import prisma from "@/lib/database";
import { CredentialType } from "@/generated/prisma/enums";

type AnthropicModel = (typeof ANTHROPIC_AVAILABLE_MODELS)[number];

export type AnthropicData = {
  model: AnthropicModel;
  credentialId: string;
  userPrompt: string;
  systemPrompt?: string;
  variableName: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(anthropicChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    if (!data.credentialId) {
      await publishStatus("error");
      throw new NonRetriableError("Anthropic Node: Credential is missing.");
    }

    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError("Anthropic Node: Variable name is missing.");
    }

    if (!data.userPrompt) {
      await publishStatus("error");
      throw new NonRetriableError("Anthropic Node: User prompt is missing.");
    }

    const system = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";

    const prompt = Handlebars.compile(data.userPrompt)(context);

    const userCredential = await step.run(
      "anthropic-fetch-credential",
      async () => {
        return await prisma.credential.findUnique({
          where: { id: data.credentialId, userId },
        });
      }
    );

    if (!userCredential || userCredential.type !== CredentialType.ANTHROPIC) {
      await publishStatus("error");
      throw new NonRetriableError("Anthropic Node: Invalid API Credential.");
    }

    // Create Anthropic instance using user credential
    const anthropic = createAnthropic({ apiKey: userCredential.value });

    // Generate text
    const result = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic(data.model),
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
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
