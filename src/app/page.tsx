import { requireAuth } from "@/lib/auth-utils";

const HomePage = async () => {
  await requireAuth()
  return <div>Protected Server Component</div>;
};

export default HomePage;
