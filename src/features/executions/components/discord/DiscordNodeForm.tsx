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

const discordFormSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, "Invalid variable name"),

  username: z.string().optional(),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Discord message content must be less than 2000 characters"),
});

export type DiscordFormValues = z.infer<typeof discordFormSchema>;

export const DiscordNodeForm = ({
  defaultValues = {},
  onSubmit,
}: {
  defaultValues?: Partial<DiscordFormValues>;
  onSubmit: (values: DiscordFormValues) => void;
}) => {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(discordFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "discord",
      username: defaultValues.username ?? "",
      webhookUrl: defaultValues.webhookUrl ?? "",
      content: defaultValues.content ?? "",
    },
  });

  const variablePreview = form.watch("variableName") || "discord";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => {
          onSubmit(v);
          form.reset({
            variableName: "discord",
            username: "",
            webhookUrl: "",
            content: "",
          });
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
                Save response as...
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="discord" className="text-sm" />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                This sets the variable key used by n8n to store the Discord
                webhook response.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Bot Username (optional)
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Bot name" className="text-sm" />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Allows this webhook call to appear as a custom bot name in
                Discord. Leave empty to use the default bot name configured in
                Discord channel settings.
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
              <FormLabel className="text-base font-semibold">
                Webhook URL
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Discord Webhook URL"
                  className="text-sm"
                />
              </FormControl>
              <div className="text-xs mt-2 text-muted-foreground">
                Steps to create a webhook in Discord:
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>Open your Discord server</li>
                  <li>
                    Right-click a channel → <b>Edit Channel</b>
                  </li>
                  <li>
                    Go to <b>Integrations</b> → <b>Webhooks</b>
                  </li>
                  <li>
                    Click <b>New Webhook</b> and copy the URL
                  </li>
                  <li>Paste the webhook URL here</li>
                </ol>
                ⚠ Rotate the URL if it ever leaks. Never store it directly in
                code or Git.
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
              <FormLabel className="text-base font-semibold">
                Message Content
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Hello from AI..."
                  className="font-mono text-xs min-h-[120px]"
                />
              </FormControl>
              <FormDescription className="text-xs mt-2">
                Discord message limit is 2000 characters. Longer messages will
                fail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit */}
        <Button type="submit" className="w-full">
          Save Discord Request
        </Button>
      </form>
    </Form>
  );
};
