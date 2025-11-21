import { AuthLayoutComp } from "@/features/auth/components/AuthLayoutComp";
import { requireUnAuth } from "@/lib/auth-utils";

async function Layout({ children }: { children: React.ReactNode }) {
  await requireUnAuth();
  return <AuthLayoutComp>{children}</AuthLayoutComp>;
}

export default Layout;
