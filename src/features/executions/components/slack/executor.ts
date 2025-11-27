import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { slackChannel } from "@/inngest/channels/slack";

export type SlackData = {
  variableName: string;
  webhookUrl: string;
  content: string;
};

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(slackChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    // Check for variable name
    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError("Slack Node: Variable name is missing.");
    }

    if (!data.webhookUrl) {
      await publishStatus("error");
      throw new NonRetriableError("Slack Node: Webhook URL is missing.");
    }

    if (!data.content) {
      await publishStatus("error");
      throw new NonRetriableError("Slack Node: Message content is missing.");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);

    await step.run("slack-webhook", async () => {
      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000),
        },
      });
    });
    await publishStatus("success");

    return {
      ...context,
      [data.variableName]: {
        slackMessageSent: true,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
