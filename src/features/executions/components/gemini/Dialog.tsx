"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GeminiFormValues, GeminiNodeForm } from "./GeminiNodeForm";

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<GeminiFormValues>;
  onSubmit: (values: GeminiFormValues) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Gemini AI</DialogTitle>
          <DialogDescription>
            Configure how this node sends a prompt to Gemini and stores the AI
            response
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto overflow-x-hidden px-6 pb-6 flex-1">
          <GeminiNodeForm
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
