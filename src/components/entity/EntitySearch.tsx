import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <InputGroup className="shadow-none border-border">
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};
