import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

export type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ context, step, data, nodeId, publish }) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(
      googleFormTriggerChannel().status({
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
  const updatedContext = await step.run("google-form-trigger", async () => {
    await sleep(10_000); // 10 seconds
    return context;
  });

  await publishStatus("success");

  return updatedContext;
};
