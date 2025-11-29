"use client";
import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Jonathan Yombo",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    quote:
      "This automation platform just works. No circus. No guesswork. After years of building pipelines, finally a tool that doesn't waste my time.",
  },
  {
    name: "Yves Kalume",
    role: "Automation Developer",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote:
      "Hooked it with GitHub, Stripe, and OpenAI in one afternoon. The type safety feels illegal. Never going back to duct-taped automations.",
  },
  {
    name: "Yucel Faruksahan",
    role: "Workflow Architect",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    quote:
      "Real-time execution logs saved me during a production meltdown. I saw the failure, replayed it, fixed it. Done. No drama.",
  },
  {
    name: "Shekinah Tshiokufila",
    role: "Senior Backend Engineer",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    quote:
      "The multi-AI node support is the killer feature. GPT, Claude, Gemini — it's not a gimmick, it's a superpower.",
  },
  {
    name: "Oketa Fred",
    role: "Fullstack Developer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote:
      "Workflows don't just run, they report back live. That's the difference between a prototype and real engineering.",
  },
  {
    name: "Zeki",
    role: "Founder @ChatExtend",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    quote:
      "We monetized automations without building billing from scratch. Stripe + Polar integration isn't a feature, it's the product.",
  },
  {
    name: "Joseph Kitheka",
    role: "Systems Engineer",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    quote:
      "Execution history, retries, and encryption that actually makes sense. This is engineer-first automation, period.",
  },
  {
    name: "Khatab Wedaa",
    role: "Full-Stack Automation Dev",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    quote:
      "Dockerized everything, shipped to Vercel, migrations deployed — it's boring the good kind of boring. Predictable.",
  },
  {
    name: "Rodrigo Aguilar",
    role: "Creator @TailwindAwesome",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote:
      "AI streaming inside workflows changed how we build user experiences. This is what modern automation should've been years ago.",
  },
  {
    name: "Eric Ampire",
    role: "Google Dev Expert – Android & Cloud",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    quote:
      "Anyone can automate. But not everyone can automate securely, scalably, and with live failure recovery. This one does.",
  },
  {
    name: "Eric Tubonge",
    role: "Platform Engineer",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    quote:
      "Finally a workflow engine that speaks TypeScript, encryption, and reliability. Everything else feels prehistoric now.",
  },
  {
    name: "Aisha Rahman",
    role: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    quote:
      "Setting up workflows that used to take hours now takes minutes. The type-safe APIs and real-time monitoring are a lifesaver for our team.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export function TestimonialSection() {
  return (
    <section id="testimonials" className="scroll-mt-24">
      <div className="space-y-7 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Loved by the Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what our users are saying about their experiences with us.
            Their stories highlight the impact and value we bring.
          </p>
        </motion.div>

        {/* Body */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-3">
              {chunk.map(({ name, role, quote, image }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-0">
                    <CardContent className="grid gap-5 p-5">
                      {/* Top row → Avatar + basic info */}
                      <div className="flex items-center gap-4">
                        <Avatar className="size-12">
                          <AvatarImage
                            alt={name}
                            src={image}
                            loading="lazy"
                            width="120"
                            height="120"
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg font-semibold">
                            {name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className="text-base font-semibold leading-tight">
                            {name}
                          </h3>
                          <p className="text-xs font-medium uppercase text-primary mt-1 tracking-wide">
                            {role}
                          </p>
                        </div>
                      </div>

                      {/* Quote section below */}
                      <blockquote className="border-l-2 pl-3 text-muted-foreground text-sm italic">
                        {quote}
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
