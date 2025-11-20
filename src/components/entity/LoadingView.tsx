import { Loader2Icon } from "lucide-react";
import React from "react";

interface LoadingViewProps {
  message?: string;
}

export const LoadingView = ({
  message,
}: LoadingViewProps) => {
  return (
    <div className="flex-1 flex justify-center items-center flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
