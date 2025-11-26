import { channel, topic } from "@inngest/realtime";
export const GEMINI_REQUEST_CHANNEL_NAME = "gemini-execution";

export const geminiChannel = channel(GEMINI_REQUEST_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
