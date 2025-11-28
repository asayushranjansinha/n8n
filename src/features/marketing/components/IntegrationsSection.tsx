"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface Integration {
  title: string;
  blurb: string;
  meta?: string;
}

interface BentoCardProps {
  span?: string;
  title: string;
  blurb: string;
  meta?: string;
}

interface SpiralConfig {
  points: number;
  dotRadius: number;
  duration: number;
  gradient: "none" | "grayscale";
  color: string;
  pulseEffect: boolean;
  opacityMin: number;
  opacityMax: number;
  sizeMin: number;
  sizeMax: number;
  background: string;
}

const IntegrationsSection: React.FC = () => {
  const spiralRef = useRef<HTMLDivElement>(null);

  const [cfg, setCfg] = useState<SpiralConfig>({
    points: 800,
    dotRadius: 1.6,
    duration: 3,
    gradient: "none",
    color: "#ffffff",
    pulseEffect: true,
    opacityMin: 0.25,
    opacityMax: 0.9,
    sizeMin: 0.5,
    sizeMax: 1.35,
    background: "transparent",
  });

  const gradients = useMemo(
    () => ({
      none: [] as string[],
      grayscale: ["#ffffff", "#999999", "#333333"],
    }),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!spiralRef.current) return;

    const SIZE = 620;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const N = cfg.points;
    const DOT = cfg.dotRadius;
    const CENTER = SIZE / 2;
    const PADDING = 4;
    const MAX_R = CENTER - PADDING - DOT;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", String(SIZE));
    svg.setAttribute("height", String(SIZE));
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);

    if (cfg.gradient !== "none") {
      const defs = document.createElementNS(svgNS, "defs");
      const g = document.createElementNS(svgNS, "linearGradient");
      g.setAttribute("id", "spiralGradient");
      g.setAttribute("gradientUnits", "userSpaceOnUse");
      g.setAttribute("x1", "0%");
      g.setAttribute("y1", "0%");
      g.setAttribute("x2", "100%");
      g.setAttribute("y2", "100%");
      gradients[cfg.gradient].forEach((color, idx, arr) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", `${(idx * 100) / (arr.length - 1)}%`);
        stop.setAttribute("stop-color", color);
        g.appendChild(stop);
      });
      defs.appendChild(g);
      svg.appendChild(defs);
    }

    for (let i = 0; i < N; i++) {
      const idx = i + 0.5;
      const frac = idx / N;
      const r = Math.sqrt(frac) * MAX_R;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x.toFixed(3));
      c.setAttribute("cy", y.toFixed(3));
      c.setAttribute("r", String(DOT));
      c.setAttribute(
        "fill",
        cfg.gradient === "none" ? cfg.color : "url(#spiralGradient)"
      );
      c.setAttribute("opacity", "0.6");

      if (cfg.pulseEffect) {
        const animR = document.createElementNS(svgNS, "animate");
        animR.setAttribute("attributeName", "r");
        animR.setAttribute(
          "values",
          `${DOT * cfg.sizeMin};${DOT * cfg.sizeMax};${DOT * cfg.sizeMin}`
        );
        animR.setAttribute("dur", `${cfg.duration}s`);
        animR.setAttribute("begin", `${(frac * cfg.duration).toFixed(3)}s`);
        animR.setAttribute("repeatCount", "indefinite");
        c.appendChild(animR);

        const animO = document.createElementNS(svgNS, "animate");
        animO.setAttribute("attributeName", "opacity");
        animO.setAttribute(
          "values",
          `${cfg.opacityMin};${cfg.opacityMax};${cfg.opacityMin}`
        );
        animO.setAttribute("dur", `${cfg.duration}s`);
        animO.setAttribute("begin", `${(frac * cfg.duration).toFixed(3)}s`);
        animO.setAttribute("repeatCount", "indefinite");
        c.appendChild(animO);
      }

      svg.appendChild(c);
    }

    spiralRef.current.innerHTML = "";
    spiralRef.current.appendChild(svg);
  }, [cfg, gradients]);

  const randomize = () => {
    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const useBW = Math.random() > 0.4;
    setCfg((c) => ({
      ...c,
      points: Math.floor(rand(400, 1800)),
      dotRadius: rand(0.8, 3),
      duration: rand(1.2, 6),
      pulseEffect: Math.random() > 0.3,
      opacityMin: rand(0.1, 0.4),
      opacityMax: rand(0.6, 1),
      sizeMin: rand(0.4, 0.9),
      sizeMax: rand(1.1, 2.1),
      gradient: useBW ? "none" : "grayscale",
      color: "#ffffff",
    }));
  };

  const integrations: Integration[] = [
    {
      title: "Slack",
      blurb: "Connect your workflows to Slack for real-time notifications.",
      meta: "Messaging",
    },
    {
      title: "Discord",
      blurb: "Automate messages, channels, and notifications on Discord.",
      meta: "Messaging",
    },
    {
      title: "Google Forms",
      blurb: "Collect and process form responses automatically.",
      meta: "Forms",
    },
    {
      title: "Stripe",
      blurb:
        "Handle payments, subscriptions, and financial workflows seamlessly.",
      meta: "Payments",
    },
    {
      title: "OpenAI",
      blurb: "Leverage AI capabilities for content generation and analysis.",
      meta: "AI",
    },
  ];

  const spans = [
    "md:col-span-4 md:row-span-2",
    "md:col-span-2 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-3 md:row-span-1",
    "md:col-span-3 md:row-span-1",
  ];

  return (
    <section className="relative mx-auto w-full max-w-5xl py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 mask-[radial-gradient(circle_at_center,rgba(255,255,255,1),rgba(255,255,255,0.1)_60%,transparent_75%)]"
        style={{ mixBlendMode: "screen" }}
      >
        <div ref={spiralRef} />
      </div>

      <div className="space-y-2 text-center mb-7">
        <h2 className="text-3xl font-bold md:text-4xl">Integrations</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Seamlessly connect your tools with n8n.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-3 md:grid-cols-6 auto-rows-[minmax(120px,auto)]">
        {integrations.map((i, idx) => (
          <BentoCard
            key={idx}
            span={spans[idx]}
            title={i.title}
            blurb={i.blurb}
            meta={i.meta}
          />
        ))}
      </div>
    </section>
  );
};

const BentoCard: React.FC<BentoCardProps> = ({
  span = "",
  title,
  blurb,
  meta,
}) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-5 transition hover:border-white/40 ${span}`}
    >
      <header className="mb-2 flex items-center gap-3">
        <span className="text-xs text-white/40">&bull;</span>
        <h3 className="text-base md:text-lg font-semibold leading-tight">
          {title}
        </h3>
        {meta && (
          <span className="ml-auto rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/60">
            {meta}
          </span>
        )}
      </header>
      <p className="text-sm text-white/70 max-w-prose">{blurb}</p>

      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100">
        <div
          className="absolute -inset-1 rounded-2xl border border-white/10"
          style={{
            maskImage:
              "radial-gradient(180px_180px_at_var(--x,50%)_var(--y,50%),white,transparent)",
          }}
        />
      </div>
    </article>
  );
};

export { IntegrationsSection };
