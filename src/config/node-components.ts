import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

import { InitialNode } from "@/components/react-flow/custom/InitialNode";
import { HttpRequestNode } from "@/features/executions/components/http-requests/Node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/Node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
