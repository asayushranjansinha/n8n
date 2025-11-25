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

  // Sleep helper
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Delay inside step
  const updatedContext = await step.run("manual-trigger", async () => {
    await sleep(10_000); // 10 seconds
    return context;
  });

  await publishStatus("success");

  return updatedContext;
};
