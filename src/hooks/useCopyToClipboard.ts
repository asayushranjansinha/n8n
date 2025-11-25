import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to Clipboard");
      setIsCopied(true);

      // reset after a short delay
      setTimeout(() => setIsCopied(false), 1500);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      setIsCopied(false);
      console.error("Failed to copy:", err);
      toast.error("Something went wrong");
    }
  };

  return { isCopied, copy };
};
