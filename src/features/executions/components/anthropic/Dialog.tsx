"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export const AVAILABLE_MODELS = [
  "claude-sonnet-4-5-20250929",
  "claude-haiku-4-5-20251001",
  "claude-opus-4-5-20251101",
  "claude-opus-4-1-20250805",
] as const;

const anthropicFormSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, "Invalid variable name"),

  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User Prompt is required"),
});

type AnthropicFormValues = z.infer<typeof anthropicFormSchema>;

const AnthropicForm = ({
  defaultValues = {},
  onSubmit,
}: {
  defaultValues?: Partial<AnthropicFormValues>;
  onSubmit: (values: AnthropicFormValues) => void;
}) => {
  const form = useForm<AnthropicFormValues>({
    resolver: zodResolver(anthropicFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "anthropic",
      model: defaultValues.model ?? AVAILABLE_MODELS[0],
      userPrompt: defaultValues.userPrompt ?? "",
      systemPrompt: defaultValues.systemPrompt ?? "You are a helpful assistant",
    },
  });

  const variablePreview = form.watch("variableName") || "response";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ---------------- Step 1 ---------------- */}
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

        {/* ---------------- Step 2 ---------------- */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Step 2: Select Model
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
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

        {/* ---------------- Step 3 ---------------- */}
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

        {/* ---------------- Step 4 ---------------- */}
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
                The main message sent to Anthropic. Supports variables:
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

export const AnthropicDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<AnthropicFormValues>;
  onSubmit: (values: AnthropicFormValues) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Anthropic AI</DialogTitle>
          <DialogDescription>
            Configure how this node sends a prompt to Anthropic and stores the
            AI response
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto overflow-x-hidden px-6 pb-6 flex-1">
          <AnthropicForm
            defaultValues={defaultValues}
            onSubmit={(v) => {
              onSubmit(v);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
