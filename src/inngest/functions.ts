import { anthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

import { generateText } from "ai";
import { inngest } from "./client";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ step }) => {
    // Step 1: Ask Gemini
    const geminiResponse = await step.ai.wrap("ask-gemini", generateText, {
      system: "You are a helpful assistant",
      prompt: "What is 2 + 2?",
      model: google("gemini-2.5-flash"),
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    // Step 2: Ask OpenAI
    // const openAIResponse = await step.ai.wrap(
    //   "ask-openai",
    //   generateText,
    //   {
    //     system: "You are a helpful assistant",
    //     prompt: "What is 2 + 2?",
    //     model: openai("gpt-4"),
    //     experimental_telemetry: {
    //       isEnabled: true,
    //       recordInputs: true,
    //       recordOutputs: true,
    //     },
    //   }
    // );

    // Step 3: Ask Anthropic
    // const anthropicResponse = await step.ai.wrap(
    //   "ask-anthropic",
    //   generateText,
    //   {
    //     system: "You are a helpful assistant",
    //     prompt: "What is 2 + 2?",
    //     model: anthropic("claude-sonnet-4-5-20250929"),
    //     experimental_telemetry: {
    //       isEnabled: true,
    //       recordInputs: true,
    //       recordOutputs: true,
    //     },
    //   }
    // );

    return {
      geminiResponse,
      // openAIResponse,
      // anthropicResponse,
    };
  },
);
