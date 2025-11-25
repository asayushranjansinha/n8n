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

  try {
    await publishStatus("loading");
    const updatedContext = await step.run("google-form-trigger", async () => {
      return context;
    });

    await publishStatus("success");

    return updatedContext;
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
