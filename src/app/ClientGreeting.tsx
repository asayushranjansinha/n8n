"use client";
// <-- hooks can only be used in client components
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
export function ClientGreeting() {
  const trpc = useTRPC();
  const users = useQuery(trpc.getUsers.queryOptions());
  if (!users.data) return <div>Loading...</div>;
  return <div>{JSON.stringify(users.data)}</div>;
}
