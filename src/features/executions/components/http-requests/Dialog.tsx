import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

// Zod schema
const httpRequestFormSchema = z.object({
  variableName: z
    .string()
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Must start with a letter or _, and contain only letters, digits, _"
    ),
  endpoint: z.url("Please enter a valid url"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  body: z.string().optional(),
});

type HttpRequestFormValues = z.infer<typeof httpRequestFormSchema>;

interface HttpRequestFormProps {
  defaultValues?: Partial<HttpRequestFormValues>;
  onSubmit: (values: HttpRequestFormValues) => void;
}

const HttpRequestForm = ({
  defaultValues = {},
  onSubmit,
}: HttpRequestFormProps) => {
  const form = useForm({
    resolver: zodResolver(httpRequestFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      method: (defaultValues.method as any) || "GET",
      endpoint: defaultValues.endpoint || "",
      body: defaultValues.body || "",
    },
  });

  const watchMethod = form.watch("method");
  const watchVariableName = form.watch("variableName") || "myVariableName";
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: HttpRequestFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 mt-4"
      >
        {/* Variable Name */}
        <FormField
          control={form.control}
          name="variableName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variable Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="myVariableName" />
              </FormControl>
              <FormDescription>
                Must start with a letter or _, and contain only letters, digits,
                _. <br /> Use this name to reference the result in other nodes,
                e.g. <code>{`{{${watchVariableName}.httpResponse.data}}`}</code>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Endpoint */}
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Endpoint</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                />
              </FormControl>
              <FormDescription>
                Static URL or use {"{{variables}}"} for simple values or{" "}
                {"{{json variable}}"} to stringify objects
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Method */}
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HTTP Request Method</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The HTTP method to use for the request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Body */}
        {showBodyField && (
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Body</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={`{
  "userId": "{{httpResponse.data.id}}",
  "name": "{{httpResponse.data.name}}",
  "items": "{{httpResponse.data.items}}"
}`}
                    className="min-h-[120px] font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>
                  Static body or use {"{variables}"} for simple values or{" "}
                  {"{json variable}"} to stringify objects
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter className="mt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// Dialog Component
interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HttpRequestFormValues) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: HttpRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Http Request</DialogTitle>
          <DialogDescription>
            Configure settings for Http Request Node
          </DialogDescription>
        </DialogHeader>
        <HttpRequestForm
          defaultValues={defaultValues}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
