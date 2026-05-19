"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Coaches() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <section id="coaches" className="relative bg-canvas">
      {/* Top section header */}
      <div className="relative px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32">
        <div className="absolute right-8 top-8 flex items-center gap-2.5 md:right-12">
          <div className="h-px w-7 bg-fg-muted" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            003 / COACHES
          </span>
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
          — MEET THE PEOPLE IN THE TRENCHES
        </div>
      </div>

      {/* Vince */}
      <CoachBlock
        index="001"
        firstName="Vince"
        lastName="Greene"
        role="OWNER + LEAD COACH"
        portraitSrc="/images/coaches/vince.jpg"
        portraitSide="right"
        verticalLabel="IN THE TRENCHES SINCE 2017"
        bio="Started Alpha Omega Fitness in 2017 with one principle: nobody gets left behind. Eight years coaching boot-camp groups means he's coached beginners through their first squat and athletes through podium finishes — often in the same hour-long class. Modifications aren't an afterthought here. They're the system."
        quote="Show up. Modify when you need to. Do the next rep. That's the whole job."
        attribution="VINCE GREENE · COACH"
        stats={[
          { label: "YEARS COACHING", value: "8" },
          { label: "GOOGLE RATING · 23 REVIEWS", value: "5.0" },
          { label: "OFFICIAL HYROX AFFILIATE · VICTOR VALLEY", value: "1" },
        ]}
        reducedMotion={reducedMotion}
      />

      {/* Section divider */}
      <div
        aria-hidden="true"
        className="relative my-8 px-6 md:my-12 md:px-12"
      >
        <div className="h-px bg-fg-muted/20" />
      </div>

      {/* Elena */}
      <CoachBlock
        index="002"
        firstName="Elena"
        lastName=""
        role="LEAD COACH"
        portraitSrc="/images/coaches/elena.jpg"
        portraitSide="left"
        verticalLabel="MEET THE PEOPLE — IN THE TRENCHES"
        bio="Lead coach. The voice in your ear when you think you can't. Elena's cue work is why Alpha Omega members compete at meets they never thought they'd do. She programs the kind of warm-ups that make the strength work feel inevitable. Form is non-negotiable here — and the reason nobody gets hurt."
        quote="Form first. Then weight. Then speed. In that order, every single time."
        attribution="ELENA · COACH"
        stats={[
          {
            label: "MEMBERS LOST TO PREVENTABLE INJURY · 8 YEARS",
            value: "0",
          },
          { label: "BEGINNERS WELCOME · ANY FITNESS LEVEL", value: "100%" },
          { label: "AM + PM CLASSES · SATURDAY HYROX", value: "MON–FRI" },
        ]}
        reducedMotion={reducedMotion}
      />

      {/* Bottom scroll cue */}
      <div className="relative px-6 py-16 md:px-12 md:py-20">
        <motion.div
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            004 / PROGRAMS →
          </span>
        </motion.div>
      </div>
    </section>
  );
}

type CoachBlockProps = {
  index: string;
  firstName: string;
  lastName: string;
  role: string;
  portraitSrc: string;
  portraitSide: "left" | "right";
  verticalLabel: string;
  bio: string;
  quote: string;
  attribution: string;
  stats: { label: string; value: string }[];
  reducedMotion: boolean;
};

function CoachBlock({
  index,
  firstName,
  lastName,
  role,
  portraitSrc,
  portraitSide,
  verticalLabel,
  bio,
  quote,
  attribution,
  stats,
  reducedMotion,
}: CoachBlockProps) {
  const fadeUp = (delay: number = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const textColClass =
    portraitSide === "right" ? "md:order-1" : "md:order-2";
  const portraitColClass =
    portraitSide === "right" ? "md:order-2" : "md:order-1";

  return (
    <div className="relative px-6 py-12 md:px-12 md:py-20">
      {/* Vertical type label — desktop only, anchored to the portrait side */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 z-10 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:block ${
          portraitSide === "right" ? "left-2" : "right-2"
        }`}
      >
        {verticalLabel}
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
        {/* Text column */}
        <div
          className={`order-2 md:col-span-7 md:order-none ${textColClass}`}
        >
          {/* Mono number + name + role */}
          <motion.div
            {...fadeUp(0)}
            className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted"
          >
            {index} / {firstName.toUpperCase()}
            {lastName ? ` ${lastName.toUpperCase()}` : ""} · {role}
          </motion.div>

          {/* Italic display name */}
          <motion.h2
            {...fadeUp(0.1)}
            className="font-medium text-fg"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
            }}
          >
            {firstName}
            {lastName && (
              <>
                <br />
                {lastName}
              </>
            )}
            .
          </motion.h2>

          {/* Bio */}
          <motion.p
            {...fadeUp(0.25)}
            className="mt-8 max-w-[48ch] text-base leading-relaxed text-fg md:text-lg"
          >
            {bio}
          </motion.p>

          {/* Pull quote */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-10 border-l-2 border-accent pl-5 md:mt-12"
          >
            <p
              className="max-w-[28ch] text-2xl leading-tight text-fg-muted md:text-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
              }}
            >
              {quote}
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              — {attribution}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.55)}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 md:mt-12 md:gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
                  {stat.label}
                </div>
                <div
                  className="leading-none text-fg"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(2.5rem, 4vw, 3rem)",
                  }}
                >
                  {stat.value}
                </div>
                <div aria-hidden="true" className="mt-2 h-px w-10 bg-accent" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Portrait column */}
        <motion.div
          {...fadeUp(0.15)}
          className={`order-1 md:col-span-5 md:order-none ${portraitColClass}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-fg/15 bg-canvas-elevated">
            <Image
              src={portraitSrc}
              alt={`${firstName}${lastName ? ` ${lastName}` : ""}, ${role}`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-canvas/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted backdrop-blur-sm">
              SUBJECT_{index} · COACH
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
