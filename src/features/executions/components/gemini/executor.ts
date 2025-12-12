import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import { GEMINI_AVAILABLE_MODELS } from "@/features/executions/constants/gemini";
import prisma from "@/lib/database";
import { CredentialType } from "@/generated/prisma";
import { decrypt } from "@/lib/encryption";

type GeminiModel = (typeof GEMINI_AVAILABLE_MODELS)[number];

export type GeminiData = {
  model: GeminiModel;
  credentialId: string;
  userPrompt: string;
  systemPrompt?: string;
  variableName: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(geminiChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    // Check for credential id
    if (!data.credentialId) {
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: GEMINI Credential is missing.");
    }

    // Check for variable name
    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: Variable node is missing.");
    }

    // Check for user prompt
    if (!data.userPrompt) {
      await publishStatus("error");
      throw new NonRetriableError("Gemini Node: User prompt is missing.");
    }

    // Compile system prompt
    const system = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";

    // Compile user prompt
    const prompt = Handlebars.compile(data.userPrompt)(context);

    // Fetch credential from database
    const userCredential = await step.run(
      "gemini-fetch-credential",
      async () => {
        return await prisma.credential.findUnique({
          where: {
            id: data.credentialId,
            userId,
          },
        });
      }
    );
    if (!userCredential || userCredential.type !== CredentialType.GEMINI) {
      await publishStatus("error");
      throw new NonRetriableError(
        "Gemini Node: Invalid Gemini API Credential."
      );
    }

    // Decrypt credential
    const decryptedCredential = decrypt(userCredential.value);

    // Create Google AI instance using user credential
    const googleAI = createGoogleGenerativeAI({ apiKey: decryptedCredential });

    // Generate text
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
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
