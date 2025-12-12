import { initTRPC, TRPCError } from "@trpc/server";
import { headers as NextHeaders } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar-client";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await NextHeaders();
  const session = await auth.api.getSession({
    headers,
  });

  // LOGGING: Check if session is present
  if (!session) {
    console.error("[AUTH_ERROR] Session not found. User is UNAUTHORIZED.");
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  console.log(`[AUTH] Session found for user ID: ${session.user.id}`);
  return next({ ctx: { ...ctx, auth: session } });
});

export const subscriptionRequiredProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    // The previous error was: Polar subscriptions list failed. Error: API error occurred: {"error":"ResourceNotFound",...}

    console.log(`[SUBSCRIPTION] Checking Polar subscription for external ID: ${ctx.auth.user.id}`);

    let customer;

    try {
      // THIS IS THE API CALL THAT FAILED WITH 404
      customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });
      console.log("[SUBSCRIPTION] Successfully retrieved customer state from Polar.");

    } catch (error) {
      // CATCHING THE EXTERNAL API ERROR
      console.error(`[SUBSCRIPTION_ERROR] Polar API request failed for user ${ctx.auth.user.id}:`, error);

      // Check for the ResourceNotFound (404) error structure from the external API
      // Since the external error structure is complex, we rethrow a FORBIDDEN error
      // The 404 often means the customer was never created (needs a better user experience).
      // We explicitly throw FORBIDDEN here, as it forces the user to the paywall.
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Subscription status could not be verified. Please ensure your account is active.",
        // You could add metadata to guide the client side:
        // cause: error,
      });
    }

    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      console.log(`[SUBSCRIPTION] User ${ctx.auth.user.id} has no active subscription. FORBIDDEN.`);
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "A paid subscription is required to access this feature.",
      });
    }

    console.log(`[SUBSCRIPTION] User ${ctx.auth.user.id} has an active subscription. Proceeding.`);
    return next({ ctx: { ...ctx, customer } });
  },
);
// TODO : implement subscriptionRequiredProcedure plan based limits