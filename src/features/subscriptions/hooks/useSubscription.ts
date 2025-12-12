import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { subscriptionPlans } from "../constants/subscriptionPlans";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const activeSubscription = customerState?.activeSubscriptions?.[0];

  // 1. Check if an active subscription exists
  const hasActiveSubscription = !!activeSubscription;

  // 2. Find the local plan details using the product_id from the Polar data
  const currentPlan = activeSubscription
    ? subscriptionPlans.find(
        // Map Polar's productId to the local plan data
        (plan) => plan.polarProductId === activeSubscription.productId
      )
    : undefined;

  // 3. Construct the subscription object with the required slug
  const subscription = activeSubscription
    ? {
        ...activeSubscription,
        // Add the product slug for easy access in the UI
        product: {
          slug: currentPlan?.polarProductSlug,
        },
      }
    : undefined;

  return {
    hasActiveSubscription,
    // Return the constructed subscription object
    subscription,
    isLoading,
    ...rest,
  };
};