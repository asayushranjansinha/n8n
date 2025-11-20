import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-center space-x-2">
        <ButtonGroup>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous"
            disabled={page === 1 || disabled}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            disabled={page === totalPages || disabled}
            variant="outline"
            size="icon-sm"
            aria-label="Next"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
