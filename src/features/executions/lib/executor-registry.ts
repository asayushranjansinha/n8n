import type { NodeExecutor } from "@/features/executions/types";
import { NodeType } from "@/generated/prisma/enums";

// Execution executor imports
import {
  type GeminiData,
  geminiExecutor,
} from "@/features/executions/components/gemini/executor";
import {
  type HttpRequestData,
  httpRequestExecutor,
} from "@/features/executions/components/http-requests/executor";
import {
  type OpenAIData,
  openAIExecutor,
} from "@/features/executions/components/openai/executor";
import {
  type AnthropicData,
  anthropicExecutor,
} from "@/features/executions/components/anthropic/executor";

// Trigger executor imports
import {
  type GoogleFormTriggerData,
  googleFormTriggerExecutor,
} from "@/features/triggers/components/google-form-trigger/executor";
import {
  type ManualTriggerData,
  manualTriggerExecutor,
} from "@/features/triggers/components/manual-trigger/executor";
import {
  type StripeTriggerData,
  stripeTriggerExecutor,
} from "@/features/triggers/components/stripe-trigger/executor";

/**
 * Union type of all allowed node types in the executor registry
 */
export type AllowedNodeTypes =
  | typeof NodeType.MANUAL_TRIGGER
  | typeof NodeType.HTTP_REQUEST
  | typeof NodeType.GOOGLE_FORM_TRIGGER
  | typeof NodeType.STRIPE_TRIGGER
  | typeof NodeType.GEMINI
  | typeof NodeType.OPENAI
  | typeof NodeType.ANTHROPIC;

/**
 * Maps each node type to its corresponding executor with typed data
 */
export interface ExecutorMap {
  [NodeType.MANUAL_TRIGGER]: NodeExecutor<ManualTriggerData>;
  [NodeType.HTTP_REQUEST]: NodeExecutor<HttpRequestData>;
  [NodeType.GOOGLE_FORM_TRIGGER]: NodeExecutor<GoogleFormTriggerData>;
  [NodeType.STRIPE_TRIGGER]: NodeExecutor<StripeTriggerData>;
  [NodeType.GEMINI]: NodeExecutor<GeminiData>;
  [NodeType.OPENAI]: NodeExecutor<OpenAIData>;
  [NodeType.ANTHROPIC]: NodeExecutor<AnthropicData>;
}

/**
 * Central registry mapping node types to their executor implementations
 */
export const executorRegistry: ExecutorMap = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openAIExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
} as const;

/**
 * Retrieves the executor for a given node type with proper type inference
 * @param type - The node type to get the executor for
 * @returns The executor function for the specified node type
 * @throws {Error} If the node type is not registered
 */
export const getExecutor = (type: AllowedNodeTypes): NodeExecutor<any> => {
  const executor = executorRegistry[type];

  if (!executor) {
    throw new Error(`No executor registered for node type: ${type}`);
  }

  return executor;
};

/**
 * Type guard to check if a node type has a registered executor
 * @param type - The node type to check
 * @returns True if the node type has a registered executor
 */
export const hasExecutor = (type: string): type is AllowedNodeTypes => {
  return type in executorRegistry;
};

/**
 * Gets all registered node types
 * @returns Array of all registered node types
 */
export const getRegisteredNodeTypes = (): AllowedNodeTypes[] => {
  return Object.keys(executorRegistry) as AllowedNodeTypes[];
};
