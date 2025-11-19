import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};
export const OAuthLoginOptions = ({ className }: Props) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Button variant={"outline"}>
        <Image
          src={"/google.svg"}
          alt="Login with Google"
          className="size-5"
          width={20}
          height={20}
        />
        Continue with Google
      </Button>
      <Button variant={"outline"}>
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
