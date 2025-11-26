import { NodeType } from "@/generated/prisma/enums";

import type { HttpRequestData } from "@/features/executions/components/http-requests/executor";
import type { NodeExecutor } from "@/features/executions/types";
import type { ManualTriggerData } from "@/features/triggers/components/manual-trigger/executor";

import {
  GeminiData,
  geminiExecutor,
} from "@/features/executions/components/gemini/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-requests/executor";
import {
  GoogleFormTriggerData,
  googleFormTriggerExecutor,
} from "@/features/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import {
  StripeTriggerData,
  stripeTriggerExecutor,
} from "@/features/triggers/components/stripe-trigger/executor";

export type AllowedNodeTypes =
  | typeof NodeType.MANUAL_TRIGGER
  | typeof NodeType.HTTP_REQUEST
  | typeof NodeType.GOOGLE_FORM_TRIGGER
  | typeof NodeType.STRIPE_TRIGGER
  | typeof NodeType.GEMINI;

export interface ExecutorMap {
  [NodeType.MANUAL_TRIGGER]: NodeExecutor<ManualTriggerData>;
  [NodeType.HTTP_REQUEST]: NodeExecutor<HttpRequestData>;
  [NodeType.GOOGLE_FORM_TRIGGER]: NodeExecutor<GoogleFormTriggerData>;
  [NodeType.STRIPE_TRIGGER]: NodeExecutor<StripeTriggerData>;
  [NodeType.GEMINI]: NodeExecutor<GeminiData>;
}

export const executorRegistry: ExecutorMap = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
};

export const getExecutor = <T extends AllowedNodeTypes>(
  type: T
): ExecutorMap[T] => {
  return executorRegistry[type];
};
