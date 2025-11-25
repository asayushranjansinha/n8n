import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

export type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  step,
  data,
  nodeId,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(
      manualTriggerChannel().status({
        nodeId,
        status,
      })
    );
  };

  await publishStatus("loading");

  const updatedContext = await step.run("manual-trigger", async () => {
    return context;
  });

  await publishStatus("success");

  return updatedContext;
};
