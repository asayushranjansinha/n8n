import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailPasswordLoginForm } from "@/features/auth/components/EmailPasswordLoginForm";
import { OAuthLoginOptions } from "@/features/auth/components/OAuthLoginOptions";
import Link from "next/link";
import React from "react";

function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-none">
      <CardHeader className="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Login in to continue with your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <EmailPasswordLoginForm />

          {/* Divider */}
          <div className="flex items-center">
            <div className="bg-border h-px flex-1" />
            <span className="px-2 text-muted-foreground text-xs font-mono">
              OR
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          <OAuthLoginOptions />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-muted-foreground text-sm">
          Dont&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
