import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { PackageOpenIcon } from "lucide-react";

interface EmptyEntityProps {
  title: string;
  message: string;
  onNew: () => void;
}

export const EmptyEntity = ({ title, message, onNew }: EmptyEntityProps) => {
  return (
    <Empty className="border border-dashed bg-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onNew}>Create New</Button>
      </EmptyContent>
    </Empty>
  );
};
