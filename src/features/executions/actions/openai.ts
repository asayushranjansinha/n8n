"use server";

import { openAiChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type OpenAIToken = Realtime.Token<typeof openAiChannel, ["status"]>;

export async function fetchOpenAIRealtimeToken(): Promise<OpenAIToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: openAiChannel(),
    topics: ["status"],
  });
  return token;
}
