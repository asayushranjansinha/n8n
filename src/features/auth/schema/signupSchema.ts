import * as z from "zod/v4";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Enter a valid name"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const defaultValues: SignupFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
