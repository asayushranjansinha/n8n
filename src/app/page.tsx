"use client";

import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const HomePage = () => {
  const trpc = useTRPC();

  const [aiResult, setAiResult] = useState<any>(null);

  const testAI = useMutation(
    trpc.test_ai.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message, { description: data.description });
        setAiResult(data); // Store latest test response
      },
    })
  );

  return (
    <div className="space-y-4">
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
        {testAI.isPending ? "Testing..." : "Test AI"}
      </Button>

      {aiResult && (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(aiResult, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default HomePage;
