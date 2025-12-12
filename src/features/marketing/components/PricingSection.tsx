"use client";

import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { subscriptionPlans } from "@/features/subscriptions/constants/subscriptionPlans";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/useSubscription";

export const PricingSection = () => {
  // Fetch current subscription data and loading state
  const { subscription, hasActiveSubscription, isLoading } =
    useHasActiveSubscription();

  // Function to redirect the user to the Polar Customer Portal for management
  const handleManage = async () => {
    // Calls the better-auth client which uses the Polar portal plugin
    const { data, error } = await authClient.customer.portal();
    if (error) {
      toast.error("Failed to open portal", {
        description: error.message,
      });
      return;
    }
    // Redirect user to the Polar customer portal link
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  const handleSubscribe = async (slug: string) => {
    // This function is only called when a fresh checkout is needed.

    // New Checkout
    const { data, error } = await authClient.checkout({
      slug,
    });
    if (error) {
      toast.error("Failed to choose your plan", {
        description: error.message,
      });
    }
    if (data) {
      toast.success("Redirecting to checkout", {
        description:
          "You will be redirected to the checkout page to finalize your plan selection.",
      });
    }
  };

  // Helper function to determine the button text, handler, and state
  const getButtonAction = (planSlug: string) => {
    // Get the slug from the processed subscription object
    const currentSlug = subscription?.product?.slug;

    // Use the extracted isLoading state
    if (isLoading) {
      return { text: "Loading...", handler: () => {}, disabled: true };
    }

    // Logic for Community Plan
    if (planSlug === "community") {
      // If user has ANY paid plan, Community button should offer to Change/Manage
      if (hasActiveSubscription && currentSlug !== "community") {
        return { text: "Change Plan", handler: handleManage, disabled: false };
      }
      // Otherwise, they are on Community or have no plan (treat as Current Plan)
      return { text: "Current Plan", handler: () => {}, disabled: true };
    }

    // Logic for Paid Plans (Pro, Enterprise)
    if (currentSlug === planSlug) {
      // User is currently on this specific plan
      return { text: "Manage Plan", handler: handleManage, disabled: false };
    }

    if (hasActiveSubscription) {
      // User is subscribed to a different paid plan (Upgrade/Downgrade is handled by the Portal)
      return { text: "Change Plan", handler: handleManage, disabled: false };
    }

    // User has no paid plan (or is on the free plan)
    return {
      text: `Choose ${planSlug.charAt(0).toUpperCase() + planSlug.slice(1)}`,
      handler: () => handleSubscribe(planSlug),
      disabled: false,
    };
  };

  return (
    <section id="pricing" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl w-full py-12 px-4 sm:py-16 sm:px-6 lg:px-8 space-y-7">
        {/* Section Header & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 md:pt-2">
          {subscriptionPlans.map((plan, index) => {
            const action = getButtonAction(plan.polarProductSlug);

            return (
              <motion.div
                key={plan.polarProductSlug} // Use polarProductSlug for stability
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  "bg-accent/70 backdrop-blur-sm rounded-lg border-2 overflow-hidden p-3",
                  plan.highlighted
                    ? "border-primary shadow-glow md:-translate-y-4"
                    : "border-accent shadow-elegant md:-translate-y-4"
                )}
              >
                <div className="flex flex-col items-center rounded-lg text-center space-y-3">
                  <div className="space-y-1">
                    <Badge variant={plan.highlighted ? "default" : "secondary"}>
                      {plan.planName.charAt(0).toUpperCase() +
                        plan.planName.slice(1)}
                    </Badge>
                    <p className="text-sm opacity-90">{plan.planDescription}</p>
                  </div>

                  <p className="text-4xl font-bold tracking-tight">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: plan.planCurrency,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.planPrice)}
                    <span className="text-sm font-medium text-muted-foreground">
                      /{plan.planInterval}
                    </span>
                  </p>

                  <ul className="pt-3 border-t border-gray-400 space-y-1.5">
                    {plan.planFeatures.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center text-sm opacity-80"
                      >
                        <CheckCircleIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            plan.highlighted && "text-emerald-500"
                          )}
                          aria-hidden
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={action.handler}
                    size="lg"
                    className="w-full cursor-pointer"
                    variant={plan.highlighted ? "default" : "secondary"}
                    disabled={action.disabled}
                  >
                    {action.text}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
