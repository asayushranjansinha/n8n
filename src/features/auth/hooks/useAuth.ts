import { authClient } from "@/lib/auth-client";

/**
 * Custom hook for authentication.
 * Provides access to the authenticated user, session status, and error information.
 * @returns  An object containing the user, pending status, error, and refetch function.
 */
export function useAuth() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return {
    user: session?.user,
    isPending,
    error,
    refetch,
  };
}
