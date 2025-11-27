import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

import { InitialNode } from "@/components/react-flow/custom/InitialNode";
import { AnthropicNode } from "@/features/executions/components/anthropic/Node";
import { DiscordNode } from "@/features/executions/components/discord/Node";
import { GeminiNode } from "@/features/executions/components/gemini/Node";
import { HttpRequestNode } from "@/features/executions/components/http-requests/Node";
import { OpenAiNode } from "@/features/executions/components/openai/Node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/Node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/Node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/Node";
import { SlackNode } from "@/features/executions/components/slack/Node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
