import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export function FaqsSection() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Here are some common questions and answers that you might encounter
          when using n8n. If you don't find the answer you're looking for,
          feel free to reach out.
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="bg-card dark:bg-card/50 w-full -space-y-px rounded-lg "
        defaultValue="item-1"
      >
        {questions.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="relative border-x first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
          >
            <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 px-4">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="text-muted-foreground text-center mx-auto">
        Can't find what you're looking for? Contact our{" "}
        <Link href="#" className="text-primary hover:underline">
          customer support team
        </Link>
      </p>
    </div>
  );
}

const questions = [
  {
    id: "item-1",
    title: "What is n8n?",
    content:
      "n8n is a powerful workflow automation platform that lets you connect apps, run logic, and automate repetitive tasks without coding everything from scratch.",
  },
  {
    id: "item-2",
    title: "Who should use n8n?",
    content:
      "Developers, founders, and automation builders who want full control, flexibility, and no vendor lock-in in their workflow stack.",
  },
  {
    id: "item-3",
    title: "What can I automate?",
    content:
      "Anything with an API or event — payments, AI processing, chat messages, form submissions, database updates, notifications, or multi-app business flows.",
  },
  {
    id: "item-4",
    title: "Can I build AI workflows?",
    content:
      "Yes. n8n supports nodes for Gemini, Anthropic, and OpenAI, so you can add AI logic like routing, generation, summarization, or smart decision chains.",
  },
  {
    id: "item-5",
    title: "Does n8n support payments?",
    content:
      "Yes. Stripe nodes handle checkouts, billing events, and webhook-based automation triggered by customer or subscription activity.",
  },
  {
    id: "item-6",
    title: "Can I connect chat apps?",
    content:
      "Yes. Slack and Discord nodes let workflows send alerts, approvals, messages, or run bots based on triggers, commands, or internal automation results.",
  },
  {
    id: "item-7",
    title: "How do workflows trigger?",
    content:
      "Through nodes like Manual Trigger, HTTP Webhook, or Google Forms Trigger to start automation based on events, API calls, or form submissions.",
  },
  {
    id: "item-8",
    title: "Is it open source?",
    content:
      "Yes. n8n is MIT licensed, runs locally, and lets you self-host or extend logic without platform restrictions.",
  },
  {
    id: "item-9",
    title: "Where do I start?",
    content:
      "Install n8n, explore nodes, and build workflows directly — docs and community help exist, but you'll learn faster by actually building.",
  },
];
