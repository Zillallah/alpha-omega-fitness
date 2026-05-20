"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Program = {
  index: string;
  name: string;
  tagline: string;
  description: string;
  primaryPrice: string;
  primaryUnit: string;
  tiers: string[];
  cta: string;
  emphasized?: boolean;
  badge?: string;
};

const programs: Program[] = [
  {
    index: "01",
    name: "Group Training",
    tagline: "The boot-camp core",
    description:
      "Coached strength + conditioning sessions in groups of 8–15. Every workout has modifications built in. Beginners and athletes train the same hour — different weights, same standards.",
    primaryPrice: "$109",
    primaryUnit: "/ MONTH",
    tiers: [
      "PART TIME · $99/MO",
      "3-MONTH PIF · $299",
      "6-MONTH · $589",
      "12-MONTH PIF · $1,149",
    ],
    cta: "START 5-DAY TRIAL →",
  },
  {
    index: "02",
    name: "HYROX",
    tagline: "Official Affiliate · Saturday mornings",
    description:
      "Race-format fitness. Eight 1km runs paired with eight functional stations. As an Official HYROX Gym Affiliate, AO programs these sessions to the exact race standard — whether you're competing or just want the toughest workout in Victor Valley.",
    primaryPrice: "INCLUDED",
    primaryUnit: "WITH ANY MEMBERSHIP",
    tiers: [
      "SATURDAY · 8:00 AM",
      "OFFICIAL HYROX AFFILIATE",
      "RACE-FORMAT TRAINING",
    ],
    cta: "JOIN HYROX SATURDAY →",
    emphasized: true,
    badge: "OFFICIAL HYROX GYM AFFILIATE",
  },
  {
    index: "03",
    name: "Personal Training",
    tagline: "1:1 with Coach Vince or Elena",
    description:
      "Direct coaching for athletes peaking for a meet, returners after injury, or anyone who wants every rep watched. Programmed to your specific goal, with form work prioritized over weight.",
    primaryPrice: "$200",
    primaryUnit: "/ WEEK",
    tiers: ["8 SESSIONS · $400", "12 SESSIONS · $600", "WEEKLY OR PACKAGE"],
    cta: "BOOK CONSULTATION →",
  },
];

export default function Programs() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start start"],
  });

  const slideY = useTransform(scrollYProgress, [0, 1], ["100vh", "0vh"]);

  const fadeUp = (delay: number = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div
      ref={wrapperRef}
      className="relative md:-mt-[100vh]"
      style={{ zIndex: 40 }}
    >
      <motion.section
        id="programs"
        className="relative min-h-[300vh] overflow-hidden bg-canvas"
        style={{
          y: reducedMotion || isMobile ? 0 : slideY,
        }}
      >
        <div className="sticky top-0 flex h-screen flex-col px-6 py-12 md:px-12 md:py-16">
          {/* Top-left eyebrow */}
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            — PROGRAMS
          </div>

          {/* Top-right section number */}
          <div className="absolute right-6 top-12 flex items-center gap-2.5 md:right-12 md:top-16">
            <div className="h-px w-7 bg-fg-muted" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              004 / PROGRAMS
            </span>
          </div>

          {/* Vertical accent type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-concrete md:block"
          >
            THREE WAYS · ONE STANDARD
          </div>

          {/* Display headline */}
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-8 max-w-[14ch] font-medium text-fg md:mt-12"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            Three ways to{" "}
            <span className="relative inline-block">
              train.
              <motion.span
                aria-hidden="true"
                initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -left-[2px] -right-[2px] bottom-[8px] z-[-1] h-[10px] origin-left bg-accent"
              />
            </span>
          </motion.h2>

          {/* Programs grid */}
          <div className="mx-auto mt-8 flex w-full max-w-[1400px] flex-1 items-center md:mt-12">
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
              {programs.map((program, i) => (
                <ProgramCard
                  key={program.index}
                  program={program}
                  delay={0.25 + i * 0.1}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>

          {/* Bottom tactical line */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-fg-muted/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              005 / SCHEDULE →
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function ProgramCard({
  program,
  delay,
  reducedMotion,
}: {
  program: Program;
  delay: number;
  reducedMotion: boolean;
}) {
  const fadeUp = {
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <motion.div
      {...fadeUp}
      className={`relative flex h-full flex-col border p-6 md:p-7 ${
        program.emphasized
          ? "border-accent bg-canvas-elevated"
          : "border-fg/15 bg-canvas"
      }`}
    >
      {/* Affiliate badge if emphasized */}
      {program.badge && (
        <div className="absolute -top-3 left-6 bg-accent px-3 py-1">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-canvas">
            {program.badge}
          </span>
        </div>
      )}

      {/* Mono index + tagline */}
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-mono text-xs tracking-[0.22em] text-fg-muted">
          {program.index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
          {program.tagline}
        </span>
      </div>

      {/* Display name */}
      <h3
        className={`leading-[0.95] tracking-[-0.03em] ${
          program.emphasized ? "text-accent" : "text-fg"
        }`}
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
        }}
      >
        {program.name}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-[15px]">
        {program.description}
      </p>

      {/* Price section */}
      <div className="mt-5 border-t border-fg/15 pt-5">
        <div className="flex items-baseline gap-2">
          <span
            className={`leading-none ${
              program.emphasized ? "text-accent" : "text-fg"
            }`}
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            {program.primaryPrice}
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-fg-muted">
            {program.primaryUnit}
          </span>
        </div>

        {/* Tier list */}
        <ul className="mt-3 space-y-1.5">
          {program.tiers.map((tier, i) => (
            <li
              key={i}
              className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-fg-muted"
            >
              <span
                className={
                  program.emphasized ? "text-accent" : "text-fg-muted"
                }
              >
                ·
              </span>{" "}
              {tier}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <a
        href="#trial"
        className={`mt-5 inline-flex items-center justify-between gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
          program.emphasized
            ? "bg-accent text-canvas hover:bg-fg"
            : "border border-fg/30 text-fg hover:border-accent hover:text-accent"
        }`}
      >
        {program.cta}
      </a>
    </motion.div>
  );
}
