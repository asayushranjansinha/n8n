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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Zod schema
const httpRequestFormSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Must start with a letter or _, and contain only letters, digits, _"
    )
    .refine((val) => {
      const reserved = [
        "return",
        "function",
        "class",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "do",
        "switch",
        "case",
        "break",
        "continue",
        "default",
        "throw",
        "try",
        "catch",
        "finally",
      ];
      return !reserved.includes(val.toLowerCase());
    }, "Cannot use JavaScript reserved words"),
  endpoint: z.string("Please enter a valid url"),
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
      method: defaultValues.method || "GET",
      endpoint: defaultValues.endpoint || "",
      body: defaultValues.body || "",
    },
  });

  const watchMethod = form.watch("method");
  const watchVariableName = form.watch("variableName") || "response";
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: HttpRequestFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="gap-6 flex flex-col"
      >
        {/* Step 1: What do you want to call this response? */}
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
                  placeholder="e.g., userData, postData, userList"
                  className="text-sm"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-600 mt-2 wrap-break-words">
                This is what you'll type in other nodes to use this data.
                <br />
                <span className="text-blue-600 font-mono mt-1 inline-block break-all">
                  {`Use: {{${watchVariableName}.httpResponse.data}}`}
                </span>
                <br />
                <span className="text-gray-500 text-xs mt-1">
                  ✓ Start with letter or underscore
                  <br />✓ Use camelCase (no spaces)
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Step 2: Where to send the request? */}
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Step 2: Where to send the request?
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://api.example.com/users"
                  className="text-sm"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-600 mt-2 wrap-break-words">
                Enter the API endpoint. You can also reference data from
                previous steps.
                <br />
                <span className="text-gray-700 font-mono text-xs mt-1 inline-block bg-gray-50 px-2 py-1 rounded">
                  Examples:
                </span>
                <br />
                <span className="text-gray-600 text-xs block space-y-1">
                  <span className="block">
                    • Static:{" "}
                    <code className="text-blue-600 break-all">
                      https://api.example.com/posts
                    </code>
                  </span>
                  <span className="block">
                    • Dynamic:{" "}
                    <code className="text-blue-600 break-all">
                      https://api.example.com/posts/
                      {"{{postData.httpResponse.data.id}}"}/comments
                    </code>
                  </span>
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Step 3: How to send it? */}
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Step 3: How to send it?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">
                      <span className="font-medium">GET</span> - Fetch data
                    </SelectItem>
                    <SelectItem value="POST">
                      <span className="font-medium">POST</span> - Create
                      something new
                    </SelectItem>
                    <SelectItem value="PUT">
                      <span className="font-medium">PUT</span> - Replace
                      existing data
                    </SelectItem>
                    <SelectItem value="PATCH">
                      <span className="font-medium">PATCH</span> - Update
                      specific fields
                    </SelectItem>
                    <SelectItem value="DELETE">
                      <span className="font-medium">DELETE</span> - Remove data
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="text-xs text-gray-600 mt-2">
                Choose based on what action you want to perform
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Step 4: What data to send? (only for POST, PUT, PATCH) */}
        {showBodyField && (
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Step 4: What data to send?
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={`{\n  "title": "My post",\n  "userId": "{{userData.httpResponse.data.id}}"\n}`}
                    className="min-h-[140px] font-mono text-xs"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-600 mt-2 wrap-break-words">
                  Write JSON. You can include data from previous steps.
                  <br />
                  <span className="text-gray-700 font-mono text-xs mt-1 inline-block bg-gray-50 px-2 py-1 rounded">
                    Common patterns:
                  </span>
                  <br />
                  <span className="text-gray-600 text-xs block space-y-1">
                    <span className="block">
                      • Use previous data:{" "}
                      <code className="text-blue-600 break-all">{`{{userData.httpResponse.data.name}}`}</code>
                    </span>
                    <span className="block">
                      • Convert to string:{" "}
                      <code className="text-blue-600 break-all">{`{{json items}}`}</code>
                    </span>
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Request"}
          </Button>
        </div>
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
      <DialogContent className="max-h-[80vh] w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        {/* Header stays on top */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Http Request</DialogTitle>
          <DialogDescription>
            Configure settings for Http Request Node
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="overflow-y-auto overflow-x-hidden px-6 pb-6 flex-1">
          <HttpRequestForm
            defaultValues={defaultValues}
            onSubmit={(values) => {
              onSubmit(values);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
