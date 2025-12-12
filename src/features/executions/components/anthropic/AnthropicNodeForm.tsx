"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { CredentialType } from "@/generated/prisma";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCredentialsByType } from "@/features/credentials/hooks/useCredentials";
import { ANTHROPIC_AVAILABLE_MODELS } from "@/features/executions/constants/anthropic";
import { useRouter } from "next/navigation";

const anthropicFormSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, "Invalid variable name"),

  model: z.enum(ANTHROPIC_AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  credentialId: z.string().min(1, "Credential is required"),
  userPrompt: z.string().min(1, "User Prompt is required"),
});

export type AnthropicFormValues = z.infer<typeof anthropicFormSchema>;

export const AnthropicNodeForm = ({
  defaultValues = {},
  onSubmit,
}: {
  defaultValues?: Partial<AnthropicFormValues>;
  onSubmit: (values: AnthropicFormValues) => void;
}) => {
  const router = useRouter();

  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.ANTHROPIC);

  const form = useForm<AnthropicFormValues>({
    resolver: zodResolver(anthropicFormSchema),
    defaultValues: {
      credentialId: defaultValues.credentialId ?? "",
      variableName: defaultValues.variableName ?? "anthropic",
      model: defaultValues.model ?? ANTHROPIC_AVAILABLE_MODELS[0],
      userPrompt: defaultValues.userPrompt ?? "",
      systemPrompt: defaultValues.systemPrompt ?? "You are a helpful assistant",
    },
  });

  const variablePreview = form.watch("variableName") || "response";

  useEffect(() => {
    if (!isLoadingCredentials && credentials && credentials.length === 0) {
      toast("Anthropic API key not found", {
        description: "Add an API key in Credentials to use this node.",
        action: {
          label: "Add API Key",
          onClick: () => router.push("/credentials"),
        },
      });
    }
  }, [isLoadingCredentials, credentials, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => {
          onSubmit(v);
          form.reset();
        })}
        className="space-y-6"
      >
        {/* variableName */}
        <FormField
          control={form.control}
          name="variableName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Step 1: Save response as...
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. aiContent"
                  className="text-sm"
                />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Access the AI output in later steps using:
                <br />
                <span className="text-blue-600 font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                  {`{{${variablePreview}.aiResponse}}`}
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Step 2: Select Model
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANTHROPIC_AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Choose which Anthropic model will process your prompt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* credentialId */}
        <FormField
          name="credentialId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose your API Key</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={
                    isLoadingCredentials ||
                    !credentials ||
                    credentials.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select API Key" />
                  </SelectTrigger>
                  <SelectContent>
                    {credentials?.map((credential) => (
                      <SelectItem key={credential.id} value={credential.id}>
                        <div className="flex gap-2.5 text-sm items-baseline justify-between">
                          <span className="font-medium">{credential.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Created{" "}
                            {formatDistanceToNow(credential.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Choose which API key will process your prompt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* System Prompt */}
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Step 3: System Prompt (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="font-mono text-xs min-h-[100px]"
                  placeholder="You are a helpful assistant..."
                />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Sets the behavior/personality of the model for this request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* userPrompt */}
        <FormField
          control={form.control}
          name="userPrompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  className="font-mono text-xs min-h-[140px]"
                  placeholder="Write your prompt for the AI here..."
                />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                The main message sent to Anthropic. Supports variables like:
                <br />
                <code className="text-blue-600">{`{{userData.name}}`}</code>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full">
          Save Anthropic Request
        </Button>
      </form>
    </Form>
  );
};
