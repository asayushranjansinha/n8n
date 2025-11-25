
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface ManualTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = (props: ManualTriggerDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            Start a workflow instantly with no setup required.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 text-sm text-muted-foreground">
          {/* What this is */}
          <div>
            <p className="font-semibold text-foreground text-base mb-1">
              What is a Manual Trigger?
            </p>
            <p>
              This trigger lets you run the workflow on demand. It&apos;s ideal for
              testing steps, debugging, or running workflows that don&apos;t rely on
              external events.
            </p>
          </div>

          {/* How it works */}
          <div>
            <p className="font-semibold text-foreground text-base mb-1">
              How does it work?
            </p>
            <p>
              When you click{" "}
              <span className="font-medium">Execute Workflow</span>, the
              workflow starts immediately and executes from this node forward.
            </p>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs text-gray-600">
              ✓ No configuration needed
              <br />
              ✓ Perfect for testing and development
              <br />✓ Always runs with empty input data unless later nodes
              transform it
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
