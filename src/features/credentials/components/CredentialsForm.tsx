"use client";

import { Credential } from "@/generated/prisma";
import { CredentialType } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

import {
  useCreateCredential,
  useUpdateCredential,
} from "@/features/credentials/hooks/useCredentials";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface CredentialsFormProps extends React.ComponentProps<"form"> {
  initialData?: Omit<Credential, "value">;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(CredentialType, "Please select a credential type"),
  value: z.string().min(1, { message: "Value is required" }),
});

type CredentialsFormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    name: "Open AI API KEY",
    value: CredentialType.OPENAI,
    image: "/openai.svg",
  },
  {
    name: "Gemini API KEY",
    value: CredentialType.GEMINI,
    image: "/gemini.svg",
  },
  {
    name: "Anthropic API KEY",
    value: CredentialType.ANTHROPIC,
    image: "/anthropic.svg",
  },
];

export const CredentialsForm = ({
  initialData,
  className,
  ...props
}: CredentialsFormProps) => {
  const router = useRouter();

  const createCredential = useCreateCredential();
  const upgradeCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          value: "", // Value is sensitive and should not be pre-filled
        }
      : {
          name: "",
          type: CredentialType.OPENAI,
          value: "",
        },
  });

  const onSubmit = (values: CredentialsFormValues) => {
    if (initialData?.id) {
      upgradeCredential.mutate(
        { id: initialData.id, ...values },
        {
          onError(error) {
            handleError(error);
          },
          onSuccess(data) {
            router.push(`/credentials/${data.id}`);
          },
        }
      );
    } else {
      createCredential.mutate(values, {
        onError(error) {
          handleError(error);
        },
        onSuccess(data) {
          router.back();
        },
      });
    }
  };

  const isPending = createCredential.isPending || upgradeCredential.isPending;

  return (
    <>
      {modal}

      <Form {...form}>
        <form
          {...props}
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6 w-full flex-1", className)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentialTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <img
                              src={option.image}
                              alt={option.name}
                              className="size-5"
                            />
                            {option.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="sk-............."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row md:justify-end mt-auto gap-3">
            <Button variant="outline" asChild type="button">
              <Link href="/credentials" prefetch>
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {initialData?.id ? "Update Credential" : "Create Credential"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
