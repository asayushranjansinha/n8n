import { PackageOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyEntityProps {
  title: string;
  message: string;
  onNew?: () => void;
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
        {onNew && <Button onClick={onNew}>Create New</Button>}
      </EmptyContent>
    </Empty>
  );
};
