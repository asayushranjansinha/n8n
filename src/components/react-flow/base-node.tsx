import type { ComponentProps } from "react";
import { CheckCircleIcon, Loader2, XCircleIcon } from "lucide-react";

import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { cn } from "@/lib/utils";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: NodeStatus;
}

const StatusIcon = ({ status }: { status: NodeStatus }) => {
  const containerClasses =
    "absolute right-0.5 bottom-0.5 flex items-center justify-center w-2 h-2";
  const iconClasses = "size-full stroke-[3px]";

  switch (status) {
    case "error":
      return (
        <div className={containerClasses}>
          <XCircleIcon className={cn(iconClasses, "text-red-700")} />
        </div>
      );
    case "success":
      return (
        <div className={containerClasses}>
          <CheckCircleIcon className={cn(iconClasses, "text-green-700")} />
        </div>
      );
    case "loading":
      return (
        <div className={containerClasses}>
          <Loader2 className={cn(iconClasses, "text-blue-700 animate-spin")} />
        </div>
      );
    default:
      return null;
  }
};

export function BaseNode({ className, status, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative rounded-sm border border-muted-foreground hover:bg-accent",
        "hover:ring-1",
        "[.react-flow\\_\\_node.selected_&]:border-muted-foreground",
        "[.react-flow\\_\\_node.selected_&]:shadow-lg",
        className
      )}
      tabIndex={0}
      {...props}
    >
      {props.children}
      {status && status !== "initial" && <StatusIcon status={status} />}
    </div>
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        className
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("select-none flex-1 font-semibold", className)}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 p-3", className)}
      {...props}
    />
  );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className
      )}
      {...props}
    />
  );
}
