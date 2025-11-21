import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  useSuspenseWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/useWorkflows";
import React, { useEffect, useRef, useState } from "react";

export const EditorHeaderInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflowName = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);

    try {
      await updateWorkflowName.mutateAsync({ id: workflow.id, name });
    } catch (error) {
      setName(workflow.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };
  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-[100px] px-2"
        disabled={updateWorkflowName.isPending}
      />
    );
  }
  return (
    <BreadcrumbItem
      className="cursor-pointer hover:text-foreground transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};
