import type { NodeExecutor } from "@/features/executions/types";

export type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  step,
}) => {
  const updatedContext = await step.run("manual-trigger", async () => {
    return context;
  });

  return updatedContext;
};