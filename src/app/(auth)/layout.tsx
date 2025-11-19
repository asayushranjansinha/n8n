import { requireUnAuth } from "@/lib/auth-utils";
import React from "react";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireUnAuth();
  return children;
}

export default AuthLayout;
