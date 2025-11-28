"use client";
import React, { useMemo } from "react";
import { UsersIcon, BriefcaseIcon, LinkIcon } from "lucide-react";
import {
  ActionProps,
  HeroSection,
} from "@/features/marketing/components/HeroSection";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

function MarketingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const heroData = useMemo(() => {
    return {
      title: (
        <>
          Build workflows faster <br /> Automate anything
        </>
      ),
      subtitle:
        "n8n puts powerful workflow automation in your hands. Connect apps, data, and logic without limits — built by creators, for creators.",
      actions: [
        {
          text: "Create a Workflow",
          onClick: () => {
            if (user) {
              router.push("/workflows");
            } else {
              router.push("/login");
            }
          },
          variant: "default",
        },
        {
          text: "Explore Integrations",
          onClick: () => alert("Explore Integrations clicked!"),
          variant: "outline",
        },
      ] as ActionProps[],
      stats: [
        {
          value: "200+",
          label: "Automation builders",
          icon: <UsersIcon className="h-5 w-5 text-muted-foreground" />,
        },
        {
          value: "10+",
          label: "App integrations",
          icon: <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />,
        },
        {
          value: "MIT Licensed",
          label: "Open Source",
          icon: <LinkIcon className="h-5 w-5 text-muted-foreground" />,
        },
      ],
      images: [
        "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=2070&auto=format&fit=crop",
      ],
    };
  }, [user]);
  return (
    <>
      <HeroSection {...heroData} />
    </>
  );
}

export default MarketingPage;
