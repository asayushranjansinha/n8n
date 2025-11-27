import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { discordChannel } from "@/inngest/channels/discord";

export type DiscordData = {
  variableName: string;
  webhookUrl: string;
  content: string;
  username?: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(discordChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    // Check for variable name
    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError("Discord Node: Variable name is missing.");
    }

    if (!data.webhookUrl) {
      await publishStatus("error");
      throw new NonRetriableError("Discord Node: Webhook URL is missing.");
    }

    if (!data.content) {
      await publishStatus("error");
      throw new NonRetriableError("Discord Node: Message content is missing.");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username
      ? Handlebars.compile(data.username)(context)
      : undefined;

    await step.run("discord-webhook", async () => {
      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });
    });
    await publishStatus("success");

    return {
      ...context,
      [data.variableName]: {
        discordMessageSent: true,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
