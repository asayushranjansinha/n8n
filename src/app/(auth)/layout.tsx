import { requireUnAuth } from "@/lib/auth-utils";

import { AuthLayoutComp } from "@/features/auth/components/AuthLayoutComp";

async function Layout({ children }: { children: React.ReactNode }) {
  await requireUnAuth();
  return <AuthLayoutComp>{children}</AuthLayoutComp>;
}

export default Layout;
