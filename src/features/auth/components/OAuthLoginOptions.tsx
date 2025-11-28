"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export const OAuthLoginOptions: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { signIn } = authClient;

  const handleOAuthLogin = async (provider: "github" | "google") => {
    const toastId = toast.loading("Authenticating...");
    const { error, data } = await signIn.social({ provider });

    if (error) {
      toast.error("OAuth failed. Try again.", { id: toastId });
      return;
    }

    toast.success("You're in.", { id: toastId });
    router.replace("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Button variant={"outline"} onClick={() => handleOAuthLogin("google")}>
        <Image
          src={"/google.svg"}
          alt="Login with Google"
          className="size-5"
          width={20}
          height={20}
        />
        Continue with Google
      </Button>
      <Button variant={"outline"} onClick={() => handleOAuthLogin("github")}>
        <Image
          src={"/github.svg"}
          alt="Login with Github"
          className="size-5"
          width={20}
          height={20}
        />
        Continue with GitHub
      </Button>
    </div>
  );
};
