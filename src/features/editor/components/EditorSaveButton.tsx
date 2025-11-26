import { SaveIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useAtomValue } from "jotai";

import { Button } from "@/components/ui/button";
import { editorAtom } from "@/features/editor/store/atoms";
import { useUpdateWorkflow } from "@/features/workflows/hooks/useWorkflows";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();
    saveWorkflow.mutate({ id: workflowId, nodes, edges });
  };

  /**
   * Add event listener to save on press  of `cmd + s or ctrl + s`
   */
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const cmd = isMac ? e.metaKey : e.ctrlKey;

      if (cmd && e.key.toLowerCase() === "s") {
        e.preventDefault(); // stop browser’s default save dialog
        handleSave();
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [editor, workflowId]);

  return (
    <div className="ml-auto">
      <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};
