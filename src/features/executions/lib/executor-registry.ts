import { NodeType } from "@/generated/prisma/enums";

import type { NodeExecutor } from "@/features/executions/types";
import type { ManualTriggerData } from "@/features/triggers/components/manual-trigger/executor";
import type { HttpRequestData } from "@/features/executions/components/http-requests/executor";

import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-requests/executor";
import {
  GoogleFormTriggerData,
  googleFormTriggerExecutor,
} from "@/features/triggers/components/google-form-trigger/executor";

export type AllowedNodeTypes =
  | typeof NodeType.MANUAL_TRIGGER
  | typeof NodeType.HTTP_REQUEST
  | typeof NodeType.GOOGLE_FORM_TRIGGER;

export interface ExecutorMap {
  [NodeType.MANUAL_TRIGGER]: NodeExecutor<ManualTriggerData>;
  [NodeType.HTTP_REQUEST]: NodeExecutor<HttpRequestData>;
  [NodeType.GOOGLE_FORM_TRIGGER]: NodeExecutor<GoogleFormTriggerData>;
}

export const executorRegistry: ExecutorMap = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

export const getExecutor = <T extends AllowedNodeTypes>(
  type: T
): ExecutorMap[T] => {
  return executorRegistry[type];
};
