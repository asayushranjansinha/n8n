import * as z from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Please enter a strong password"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
export const defaultValues = {
  email: "",
  password: "",
} as LoginFormValues;
