"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { NodeSelector } from "../../../components/react-flow/custom/NodeSelector";

const AddNodeButtonComponent = () => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="icon-sm" variant="outline" className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
};

export const AddNodeButton = memo(AddNodeButtonComponent);
AddNodeButton.displayName = "AddNodeButton";
