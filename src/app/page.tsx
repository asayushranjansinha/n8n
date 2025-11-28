import { BriefcaseIcon, LinkIcon, UsersIcon } from "lucide-react";

import { PillBanner } from "@/components/ui/banner";
import { FaqsSection } from "@/features/marketing/components/FaqsSection";
import { HeroSection } from "@/features/marketing/components/HeroSection";
import { TestimonialSection } from "@/features/marketing/components/TestimonialsSection";
import { Header } from "@/features/marketing/components/Header";
import { FooterSection } from "@/features/marketing/components/Footer";
import { FeaturesSection } from "@/features/marketing/components/FeaturesSection";
import { IntegrationsSection } from "@/features/marketing/components/IntegrationsSection";
import { CallToActionSection } from "@/features/marketing/components/CallToActionSection";

const heroData = {
  title: (
    <>
      Build workflows faster <br /> Automate anything
    </>
  ),
  subtitle:
    "n8n puts powerful workflow automation in your hands. Connect apps, data, and logic without limits — built by creators, for creators.",
  primaryButton: {
    label: "Create a Workflow",
    href: "/workflows",
  },
  secondaryButton: {
    label: "Explore Integrations",
    href: "/integrations",
  },
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
function MarketingPage() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <HeroSection {...heroData} />
      <PillBanner
        buttonText="Upgrade to n8n Pro"
        description="Get higher automation limits and faster workflow executions"
      />
      <FeaturesSection />
      <IntegrationsSection />
      <TestimonialSection />
      <FaqsSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
}

export default MarketingPage;
