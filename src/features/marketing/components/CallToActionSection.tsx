"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
const integrations = [
  "/youtube.svg",
  "/googleform.svg",
  "/http.svg",
  "/gemini.svg",
  "/gmail.svg",
  "/anthropic.svg",
  "/github.svg",
  "/slack.svg",
  "/discord.svg",
  "/google.svg",
  "/stripe.svg",
  "/openai.svg",
];

export function CallToActionSection() {
  return (
    <section className="container mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="uppercase text-sm font-semibold text-muted-foreground">
          Automations
        </p>
        <h2 className="text-7xl font-bold mt-2 mb-4">
          Plug Anything. Automate Everything.
        </h2>
        <p className="text-foreground/70 mb-6">
          No ceilings. No babysitting. Your stack, fully automated.
        </p>
        <div className="flex gap-4">
          <Button>
            <Link href="/workflows">Start Building</Link>
          </Button>
          <Button variant="outline">
            <Link href="/integrations">See All Integrations →</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {integrations.map((url, idx) => (
          <div
            key={idx}
            className="relative w-16 h-16 p-2 bg-background shadow-sm rounded-xl"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <Image
              src={url}
              alt={`integration-${idx}`}
              fill
              className="object-contain p-1.5"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
