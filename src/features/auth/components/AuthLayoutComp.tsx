import Image from "next/image";
import Link from "next/link";
import type React from "react";

export const AuthLayoutComp = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted min-h-svh flex flex-col gap-6 justify-center items-center px-6 md:px-10">
      {/* Logo */}
      <Link
        href="/"
        className="flex self-center items-center gap-2 text-2xl font-semibold"
      >
        <Image
          src="/logo.svg"
          alt="N8N"
          width={30}
          height={30}
          className="size-[50px]"
        />
        N8N
      </Link>
      {/* Main content */}
      {children}
    </div>
  );
};
