"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  defaultValues,
  type LoginFormValues,
  loginSchema,
} from "../schema/loginSchema";

type Props = React.ComponentProps<"form"> & {
  className?: string;
};

export const EmailPasswordLoginForm: FC<Props> = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const onFormSubmit = async (values: LoginFormValues) => {
    const { email, password } = values;

    // Show loading toast
    const toastId = toast.loading("Signing you in...");

    await authClient.signIn.email(
      {
        email,
        password,
        // callbackURL: process.env.LOGIN_CALLBACK_URL,
        rememberMe: true,
      },
      {
        onRequest: () => {
          // Already handled by loading toast
        },
        onSuccess: () => {
          toast.success("Logged in successfully!", {
            id: toastId, // replace loading toast
          });
          router.replace("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Invalid credentials", {
            id: toastId, // replace loading toast
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
        {...props}
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. asayushranjansinha@gmail.com"
                  type="email"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label={
                        showPassword ? "Hide Password" : "Show Password"
                      }
                      title={showPassword ? "Hide Password" : "Show Password"}
                      size="icon-xs"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          Log In
        </Button>
      </form>
    </Form>
  );
};
