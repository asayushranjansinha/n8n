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

export const PricingSection = () => {
  const handleSubscribe = async (slug: string) => {
    const { data, error } = await authClient.checkout({
      slug,
    });
    if (error) {
      toast.error("Failed to upgrade your plan", {
        description: error.message,
      });
    }
    if (data) {
      toast.success("Plan upgraded successfully", {
        description: "You will be redirected to the checkout page",
      });
    }
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
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={index} // TODO: use polar id
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "bg-accent/70 backdrop-blur-sm rounded-lg border-2 overflow-hidden p-3",
                plan.highlighted
                  ? "border-primary shadow-glow md:-translate-y-4"
                  : "border-accent shadow-elegant md:translate-y-4"
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
                  onClick={() => handleSubscribe(plan.polarProductSlug)}
                  size="lg"
                  className="w-full cursor-pointer"
                  variant={plan.highlighted ? "default" : "secondary"}
                >
                  Choose{" "}
                  {plan.planName.charAt(0).toUpperCase() +
                    plan.planName.slice(1)}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
