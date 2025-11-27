"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OpenAiFormValues, OpenAiNodeForm } from "./OpenAiNodeForm";

export const OpenAiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<OpenAiFormValues>;
  onSubmit: (values: OpenAiFormValues) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>OpenAI</DialogTitle>
          <DialogDescription>
            Configure how this node sends a prompt to OpenAI and stores the AI
            response
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto overflow-x-hidden px-6 pb-6 flex-1">
          <OpenAiNodeForm
            defaultValues={defaultValues}
            onSubmit={(v) => {
              onSubmit(v);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
