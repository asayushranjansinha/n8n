import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailPasswordSignupForm } from "@/features/auth/components/EmailPasswordSignupForm";
import { OAuthLoginOptions } from "@/features/auth/components/OAuthLoginOptions";

function SignupPage() {
  return (
    <Card className="w-full max-w-md shadow-none">
      <CardHeader className="text-center">
        <CardTitle>Welcome to N8N</CardTitle>
        <CardDescription>
          Signup in to continue with your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <EmailPasswordSignupForm />

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
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignupPage;
