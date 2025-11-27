import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const slackFormSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, "Invalid variable name"),
  webhookUrl: z.url("Must be a valid Slack webhook URL"),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(40000, "Slack payload limit is 40,000 characters"),
});

export type SlackFormValues = z.infer<typeof slackFormSchema>;

export const SlackNodeForm = ({
  defaultValues = {},
  onSubmit,
}: {
  defaultValues?: Partial<SlackFormValues>;
  onSubmit: (values: SlackFormValues) => void;
}) => {
  const form = useForm<SlackFormValues>({
    resolver: zodResolver(slackFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "slack",
      webhookUrl: defaultValues.webhookUrl ?? "",
      content: defaultValues.content ?? "",
    },
  });

  const variablePreview = form.watch("variableName") || "slack";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* variableName */}
        <FormField
          control={form.control}
          name="variableName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Store result in n8n as…</FormLabel>
              <FormControl>
                <Input {...field} placeholder="slack" />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                This sets the variable key used by n8n to store the Slack
                webhook response.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* webhookUrl */}
        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Slack Incoming Webhook URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://hooks.slack.com/services/…"
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                To generate a Slack webhook:
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>
                    Go to Slack API dashboard and create a <b>New App</b>
                  </li>
                  <li>
                    Select <b>From scratch</b> → pick your workspace
                  </li>
                  <li>
                    Open <b>Incoming Webhooks</b> → Turn it <b>ON</b>
                  </li>
                  <li>
                    Click <b>Add New Webhook to Workspace</b> → choose a channel
                  </li>
                  <li>Copy the generated URL and paste it here</li>
                </ol>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Slack Message / Payload</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='{"text":"Hello from n8n 🚀"}'
                  className="font-mono text-xs"
                />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Slack message limit is 40,000 characters. Longer messages will
                fail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full">
          Send to Slack
        </Button>
      </form>
    </Form>
  );
};
