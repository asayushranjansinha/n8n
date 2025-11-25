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
import {
  createGoogleFormWebHookURL,
  generateGoogleFormScript,
} from "@/features/triggers/utils/index";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface GoogleFormTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = (
  props: GoogleFormTriggerDialogProps
) => {
  const params = useParams();
  const { isCopied, copy } = useCopyToClipboard();

  const workflowId = params.workflowId as string;
  const webhookURL = createGoogleFormWebHookURL(workflowId);

  const handleCopyScript = () => {
    const script = generateGoogleFormScript(webhookURL);
    copy(script);
  };

  return (
    <Dialog {...props}>
      <DialogContent className="max-h-[80vh] w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Google Form Trigger</DialogTitle>
          <DialogDescription>
            Follow these steps to send Google Form submissions to your workflow
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
              How to Add the Script to Your Google Form
            </h4>

            <div className="space-y-1">
              <p className="text-xs">
                <strong>Step 1:</strong> Open your Google Form.
              </p>
              <p className="text-xs">
                <strong>Step 2:</strong> Click <em>Extensions → Apps Script</em>
                .
              </p>
              <p className="text-xs">
                <strong>Step 3:</strong> Copy the script below and paste it into
                the Apps Script editor.
              </p>
              <p className="text-xs">
                <strong>Step 4:</strong> Click the save icon (top-left).
              </p>
              <p className="text-xs">
                <strong>Step 5:</strong> Deploy the script by going to{" "}
                <em>Deploy → New deployment → Web App</em>. Set permissions to
                allow the script to run as you.
              </p>
              <p className="text-xs">
                <strong>Step 6:</strong> Authorize the script if prompted.
              </p>
              <p className="text-xs">
                After deployment, the script will automatically send form
                submissions to your workflow.
              </p>
            </div>
          </div>

          {/* Google Apps Script */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold text-foreground mb-1">
              Copy Google Apps Script
            </h4>
            <Button className="w-full" onClick={handleCopyScript} variant='outline'>
              {isCopied ? <CheckIcon /> : <CopyIcon />}
              Google Apps Script
            </Button>
            <p className="mt-2 text-xs">
              This script includes your Webhook URL and handles form
              submissions.
            </p>
          </div>

          {/* JSON reference */}
          <ul className="text-sm text-muted-foreground space-y-1 bg-muted rounded p-3">
            <h3 className="font-medium text-foreground">Available Variables</h3>
            <li>
              <code className="bg-background px-1 py-0.5 rounded">
                {"{{googleForm.respondentEmail}}"}
              </code>{" "}
              - Respondent's email
            </li>
            <li>
              <code className="bg-background px-1 py-0.5 rounded">
                {"{{googleForm.responses['Question Name']}}"}
              </code>{" "}
              - Specific answer
            </li>
            <li>
              <code className="bg-background px-1 py-0.5 rounded">
                {"{{json googleForm.responses}}"}
              </code>{" "}
              - All responses as JSON
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
