"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { createStripeWebhookURL } from "@/features/triggers/utils/index";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface StripeTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = (props: StripeTriggerDialogProps) => {
  const params = useParams();
  const { isCopied, copy } = useCopyToClipboard();

  const workflowId = params.workflowId as string;
  const webhookURL = createStripeWebhookURL(workflowId);

  return (
    <Dialog {...props}>
      <DialogContent className="max-h-[80vh] w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Stripe Trigger</DialogTitle>
          <DialogDescription>
            Follow these steps to send Stripe events to your workflow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm text-muted-foreground overflow-y-auto overflow-x-hidden px-6 pb-6 flex-1">
          {/* Webhook URL */}
          <div>
            <p className="font-semibold text-foreground text-base mb-1">
              Webhook URL
            </p>
            <InputGroup>
              <InputGroupInput
                placeholder={webhookURL}
                readOnly
                className="font-mono placeholder:text-blue-600 break-all"
                onDoubleClick={() => copy(webhookURL)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Copy"
                  title="Copy"
                  size="icon-xs"
                  onClick={() => copy(webhookURL)}
                >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="mt-2 text-xs">
              Double-click or use the button to copy.
            </p>
          </div>

          {/* Setup Instructions */}
          <div className="p-3 bg-muted text-muted-foreground rounded-lg select-none">
            <h4 className="font-semibold text-foreground mb-1">
              How to Set Up the Stripe Webhook
            </h4>

            <div className="space-y-1">
              <p className="text-xs">
                <strong>Step 1:</strong> Go to your Stripe Dashboard → Developers → Webhooks.
              </p>
              <p className="text-xs">
                <strong>Step 2:</strong> Click <em>Add endpoint</em>.
              </p>
              <p className="text-xs">
                <strong>Step 3:</strong> Paste the Webhook URL above.
              </p>
              <p className="text-xs">
                <strong>Step 4:</strong> Select the events you want to send to your workflow.
              </p>
              <p className="text-xs">
                <strong>Step 5:</strong> Save the webhook.
              </p>
              <p className="text-xs">
                Stripe will now send events to this workflow automatically.
              </p>
            </div>
          </div>

          {/* JSON Reference */}
          <ul className="text-sm text-muted-foreground space-y-1 bg-muted rounded p-3">
            <h3 className="font-medium text-foreground">Available Variables</h3>
            <li>
              <code className="bg-background px-1 py-0.5 rounded">
                {"{{stripe.eventType}}"}
              </code>{" "}
              - Event type (e.g., `invoice.paid`)
            </li>
            <li>
              <code className="bg-background px-1 py-0.5 rounded">
                {"{{stripe.data}}"}
              </code>{" "}
              - Event payload data
            </li>
            <li>
              <code className="bg-background px-1 py-0.5 rounded">
                {"{{json stripe.data}}"}
              </code>{" "}
              - Full event JSON
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
