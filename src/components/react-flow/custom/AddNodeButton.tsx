"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

const AddNodeButtonComponent = () => {
  return (
    <Button size="icon-sm" variant="outline" className="bg-background">
      <PlusIcon className="size-4" />
    </Button>
  );
};

export const AddNodeButton = memo(AddNodeButtonComponent);
