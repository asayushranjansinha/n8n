import type { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export type stripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<stripeTriggerData> = async ({
  context,
  step,
  data,
  nodeId,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(
      stripeTriggerChannel().status({
        nodeId,
        status,
      })
    );
  };
  try {
    await publishStatus("loading");

    const updatedContext = await step.run("stripe-trigger", async () => {
      return context;
    });

    await publishStatus("success");

    return updatedContext;
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
