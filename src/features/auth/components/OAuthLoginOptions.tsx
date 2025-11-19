import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
};
export const OAuthLoginOptions = ({ className }: Props) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Button variant={"outline"}>Continue with Google</Button>
      <Button variant={"outline"}>Continue with GitHub</Button>
    </div>
  );
};
