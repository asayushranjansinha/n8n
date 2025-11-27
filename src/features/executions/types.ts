import type { Realtime } from "@inngest/realtime";
import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;
export type StepTools = GetStepTools<Inngest, any>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId:string;
  context: WorkflowContext;
  step: StepTools;
  publish: Realtime.PublishFn;
}

export type NodeExecutor<
  TData = Record<string, unknown>,
  TOutput extends WorkflowContext = WorkflowContext
> = (params: NodeExecutorParams<TData>) => Promise<TOutput>;
