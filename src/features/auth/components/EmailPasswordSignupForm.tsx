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
  type SignupFormValues,
  signupSchema,
} from "../schema/signupSchema";

type Props = React.ComponentProps<"form"> & {
  className?: string;
};

export const EmailPasswordSignupForm: FC<Props> = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const onFormSubmit = async (values: SignupFormValues) => {
    const { email, password, name } = values;

    // Show loading toast and keep reference
    const toastId = toast.loading("Creating your account...");

    await authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: process.env.SIGNUP_CALLBACK_URL,
      },
      {
        onRequest: () => {
          // Already handled by loading toast
        },
        onSuccess: () => {
          toast.success("Account created successfully!", {
            id: toastId, // replaces the loading toast
          });
          router.replace("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Something went wrong", {
            id: toastId, // replaces the loading toast
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
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Ayush Ranjan Sinha"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label={
                        showConfirmPassword ? "Hide Password" : "Show Password"
                      }
                      title={
                        showConfirmPassword ? "Hide Password" : "Show Password"
                      }
                      size="icon-xs"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          Create Account
        </Button>
      </form>
    </Form>
  );
};
