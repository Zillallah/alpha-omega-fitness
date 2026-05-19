"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type CoachData = {
  index: string;
  firstName: string;
  lastName: string;
  role: string;
  portraitSrc: string;
  portraitSide: "left" | "right";
  bio: string;
  quote: string;
  attribution: string;
  stats: { label: string; value: string }[];
  verticalLabel: string;
  sectionLabel: string;
};

const vinceData: CoachData = {
  index: "001",
  firstName: "Vince",
  lastName: "Greene",
  role: "OWNER + LEAD COACH",
  portraitSrc: "/images/coaches/vince.jpg",
  portraitSide: "right",
  bio: "Started Alpha Omega Fitness in 2017 with one principle: nobody gets left behind. Eight years coaching boot-camp groups means he's coached beginners through their first squat and athletes through podium finishes — often in the same hour-long class. Modifications aren't an afterthought here. They're the system.",
  quote: "Show up. Modify when you need to. Do the next rep. That's the whole job.",
  attribution: "VINCE GREENE · COACH",
  stats: [
    { label: "YEARS COACHING", value: "8" },
    { label: "GOOGLE RATING · 23 REVIEWS", value: "5.0" },
    { label: "HYROX AFFILIATE", value: "1" },
  ],
  verticalLabel: "IN THE TRENCHES SINCE 2017",
  sectionLabel: "003 / COACHES",
};

const elenaData: CoachData = {
  index: "002",
  firstName: "Elena",
  lastName: "",
  role: "LEAD COACH",
  portraitSrc: "/images/coaches/elena.jpg",
  portraitSide: "left",
  bio: "Lead coach. The voice in your ear when you think you can't. Elena's cue work is why Alpha Omega members compete at meets they never thought they'd do. She programs the kind of warm-ups that make the strength work feel inevitable. Form is non-negotiable here — and the reason nobody gets hurt.",
  quote: "Form first. Then weight. Then speed. In that order, every single time.",
  attribution: "ELENA · COACH",
  stats: [
    { label: "INJURIES IN 8 YEARS", value: "0" },
    { label: "BEGINNERS WELCOME", value: "100%" },
    { label: "CLASSES PER WEEK", value: "MON–SAT" },
  ],
  verticalLabel: "MEET THE PEOPLE",
  sectionLabel: "003 / COACHES",
};

/**
 * Coaches — Batch 2.6 / section 003.
 * Eclipse stack-reveal: Vince's section overlaps Manifesto's tail via
 * -mt-[100vh] and slides up from 100vh to 0vh. Elena does the same over
 * Vince. Each coach gets a full-viewport moment before being eclipsed.
 * z-index ladder: Manifesto z-10, Vince z-20, Elena z-30.
 */
export default function Coaches() {
  return (
    <>
      <CoachEclipse data={vinceData} zIndex={20} />
      <CoachEclipse data={elenaData} zIndex={30} />
    </>
  );
}

function CoachEclipse({ data, zIndex }: { data: CoachData; zIndex: number }) {
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

  // Section slides UP from below — eclipsing what came before
  const slideY = useTransform(scrollYProgress, [0, 1], ["100vh", "0vh"]);

  const fadeUp = (delay: number = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const isLeft = data.portraitSide === "left";

  return (
    <div
      ref={wrapperRef}
      className="relative md:-mt-[100vh]"
      style={{ zIndex }}
    >
      <motion.section
        className="relative min-h-screen overflow-hidden bg-canvas"
        style={{
          y: reducedMotion || isMobile ? 0 : slideY,
        }}
      >
        {/* Top-right section number */}
        <div className="absolute right-8 top-8 z-30 flex items-center gap-2.5 md:right-12">
          <div className="h-px w-7 bg-fg-muted" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            {data.sectionLabel}
          </span>
        </div>

        {/* Vertical type — opposite side from portrait */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 z-10 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:block ${
            isLeft ? "right-3" : "left-3"
          }`}
        >
          {data.verticalLabel}
        </div>

        {/* Top-left tactical eyebrow */}
        <div className="absolute left-8 top-8 z-30 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted md:left-12">
          — MEET THE PEOPLE
        </div>

        {/* Main content grid */}
        <div className="relative flex min-h-screen items-center px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
            {/* Portrait column */}
            <motion.div
              {...fadeUp(0.15)}
              className={`order-1 md:col-span-5 md:order-none ${
                isLeft ? "md:order-1" : "md:order-2"
              }`}
            >
              <div
                className="relative w-full overflow-hidden border border-fg/15 bg-canvas-elevated"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={data.portraitSrc}
                  alt={`${data.firstName}${data.lastName ? ` ${data.lastName}` : ""}, ${data.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  style={{ objectPosition: "center top" }}
                  priority
                />
                {/* Subject label */}
                <div className="absolute bottom-3 left-3 z-10 bg-canvas/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted backdrop-blur-sm">
                  SUBJECT_{data.index} · COACH
                </div>
                {/* Corner brackets on portrait */}
                <div
                  aria-hidden="true"
                  className="absolute left-2 top-2 h-4 w-4 border-l border-t border-accent"
                />
                <div
                  aria-hidden="true"
                  className="absolute right-2 top-2 h-4 w-4 border-r border-t border-accent"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-accent"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-accent"
                />
              </div>
            </motion.div>

            {/* Text column */}
            <div
              className={`order-2 md:col-span-7 md:order-none ${
                isLeft ? "md:order-2" : "md:order-1"
              }`}
            >
              {/* Mono number + name + role */}
              <motion.div
                {...fadeUp(0)}
                className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted"
              >
                {data.index} / {data.firstName.toUpperCase()}
                {data.lastName ? ` ${data.lastName.toUpperCase()}` : ""} ·{" "}
                {data.role}
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
                {data.firstName}
                {data.lastName && (
                  <>
                    <br />
                    {data.lastName}
                  </>
                )}
                .
              </motion.h2>

              {/* Bio */}
              <motion.p
                {...fadeUp(0.25)}
                className="mt-8 max-w-[48ch] text-base leading-relaxed text-fg md:text-lg"
              >
                {data.bio}
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
                  {data.quote}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                  — {data.attribution}
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                {...fadeUp(0.55)}
                className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 md:mt-12 md:gap-8"
              >
                {data.stats.map((stat, i) => (
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
                    <div
                      aria-hidden="true"
                      className="mt-2 h-px w-10 bg-accent"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
