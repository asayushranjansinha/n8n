import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Ensures the user is authenticated.
 * If no valid session is found, redirects to the login page.
 *
 * @returns The current user session.
 */
export async function requireAuth() {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return redirect("/login");
  }
  return session;
}

/**
 * Ensures the user is NOT authenticated.
 * If a valid session exists, redirects to the home page.
 *
 * @returns The current user session (null when unauthenticated).
 */
export async function requireUnAuth() {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });

  if (session) {
    return redirect("/");
  }
  return session;
}
