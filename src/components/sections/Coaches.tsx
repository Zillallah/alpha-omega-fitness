"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type NameLine = { text: string; vector: { x: number; y: number } };
type Stat = { value: string; label: string };

type CoachData = {
  number: string;
  role: string;
  nameLines: NameLine[];
  bio: string;
  quote: string;
  attribution: string;
  stats: Stat[];
  imageSrc: string;
  imageLabel: string;
  subjectLabel: string;
};

type Reveals = {
  name: { opacity: MotionValue<number>; y: MotionValue<number> };
  bio: { opacity: MotionValue<number>; y: MotionValue<number> };
  quote: { opacity: MotionValue<number>; y: MotionValue<number> };
  stats: { opacity: MotionValue<number>; y: MotionValue<number> };
  portrait: { opacity: MotionValue<number>; y: MotionValue<number> };
};

const VINCE: CoachData = {
  number: "001",
  role: "OWNER + LEAD COACH",
  nameLines: [
    { text: "Vince", vector: { x: -60, y: 0 } },
    { text: "Greene.", vector: { x: 60, y: 20 } },
  ],
  bio: "Started Alpha Omega Fitness in 2017 with one principle: nobody gets left behind. Eight years coaching boot-camp groups means he's coached beginners through their first squat and athletes through podium finishes — often in the same hour-long class. Modifications aren't an afterthought here. They're the system.",
  quote:
    "Show up. Modify when you need to. Do the next rep. That's the whole job.",
  attribution: "— VINCE GREENE · COACH",
  stats: [
    { value: "8", label: "YEARS COACHING" },
    { value: "5.0", label: "GOOGLE RATING · 23 REVIEWS" },
    { value: "1", label: "OFFICIAL HYROX AFFILIATE · VICTOR VALLEY" },
  ],
  imageSrc: "/images/coaches/vince.jpg",
  imageLabel: "_VINCE",
  subjectLabel: "SUBJECT_01 · COACH",
};

const ELENA: CoachData = {
  number: "002",
  role: "LEAD COACH",
  nameLines: [{ text: "Elena.", vector: { x: 0, y: 80 } }],
  bio: "Lead coach. The voice in your ear when you think you can't. Elena's cue work is why Alpha Omega members compete at meets they never thought they'd do. She programs the kind of warm-ups that make the strength work feel inevitable. Form is non-negotiable here — and the reason nobody gets hurt.",
  quote: "Form first. Then weight. Then speed. In that order, every single time.",
  attribution: "— ELENA · COACH",
  stats: [
    {
      value: "0",
      label: "MEMBERS LOST TO PREVENTABLE INJURY · 8 YEARS",
    },
    { value: "100%", label: "BEGINNERS WELCOME · ANY FITNESS LEVEL" },
    { value: "MON–FRI", label: "AM + PM CLASSES · SATURDAY HYROX" },
  ],
  imageSrc: "/images/coaches/elena.jpg",
  imageLabel: "_ELENA",
  subjectLabel: "SUBJECT_02 · COACH",
};

/**
 * Coaches — Batch 2.4 / section 003.
 * 180vh: two sticky frames, scroll-bound reveals locked to scrollYProgress.
 * No more whileInView triggers — reveals are deterministic by scroll position,
 * so fast-scrolling users see the same composition as slow-scrolling users.
 *
 * Stack-reveal wrapper (Batch 2.2) slides the section up over Manifesto's
 * Act IV exit zone. Frame cross-fade happens at scroll 0.42–0.58.
 */
export default function Coaches() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---- Stack-reveal: section rises from below Manifesto's exit zone ---- */
  const { scrollYProgress: wrapperProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start start"],
  });
  const stackY = useTransform(wrapperProgress, [0, 1], ["100vh", "0vh"]);

  /* ---- Internal Vince/Elena reveal choreography ---- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Frame cross-fade — Vince fades out, Elena fades in across the 0.42–0.58 zone */
  const vinceFrameOpacity = useTransform(scrollYProgress, [0.42, 0.5], [1, 0]);
  const elenaFrameOpacity = useTransform(scrollYProgress, [0.5, 0.58], [0, 1]);

  /* Vince reveals (Frame A: scrollYProgress 0 → 0.5) */
  const vinceNameOpacity = useTransform(scrollYProgress, [0.0, 0.06], [0, 1]);
  const vinceNameY = useTransform(scrollYProgress, [0.0, 0.06], [40, 0]);
  const vinceBioOpacity = useTransform(scrollYProgress, [0.04, 0.1], [0, 1]);
  const vinceBioY = useTransform(scrollYProgress, [0.04, 0.1], [30, 0]);
  const vinceQuoteOpacity = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);
  const vinceQuoteY = useTransform(scrollYProgress, [0.08, 0.14], [30, 0]);
  const vinceStatsOpacity = useTransform(scrollYProgress, [0.12, 0.18], [0, 1]);
  const vinceStatsY = useTransform(scrollYProgress, [0.12, 0.18], [30, 0]);
  const vincePortraitOpacity = useTransform(scrollYProgress, [0.0, 0.08], [0, 1]);
  /* Vince portrait combines reveal (60→0) with parallax (0→-40) */
  const vincePortraitY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.5],
    [60, 0, -40]
  );

  /* Elena reveals (Frame B: scrollYProgress 0.5 → 1.0) */
  const elenaNameOpacity = useTransform(scrollYProgress, [0.5, 0.56], [0, 1]);
  const elenaNameY = useTransform(scrollYProgress, [0.5, 0.56], [40, 0]);
  const elenaBioOpacity = useTransform(scrollYProgress, [0.54, 0.6], [0, 1]);
  const elenaBioY = useTransform(scrollYProgress, [0.54, 0.6], [30, 0]);
  const elenaQuoteOpacity = useTransform(scrollYProgress, [0.58, 0.64], [0, 1]);
  const elenaQuoteY = useTransform(scrollYProgress, [0.58, 0.64], [30, 0]);
  const elenaStatsOpacity = useTransform(scrollYProgress, [0.62, 0.68], [0, 1]);
  const elenaStatsY = useTransform(scrollYProgress, [0.62, 0.68], [30, 0]);
  const elenaPortraitOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.58],
    [0, 1]
  );
  const elenaPortraitY = useTransform(
    scrollYProgress,
    [0.5, 0.58, 1],
    [60, 0, -40]
  );

  const cinematic = !isMobile && !reducedMotion;

  const vinceReveals: Reveals = {
    name: { opacity: vinceNameOpacity, y: vinceNameY },
    bio: { opacity: vinceBioOpacity, y: vinceBioY },
    quote: { opacity: vinceQuoteOpacity, y: vinceQuoteY },
    stats: { opacity: vinceStatsOpacity, y: vinceStatsY },
    portrait: { opacity: vincePortraitOpacity, y: vincePortraitY },
  };

  const elenaReveals: Reveals = {
    name: { opacity: elenaNameOpacity, y: elenaNameY },
    bio: { opacity: elenaBioOpacity, y: elenaBioY },
    quote: { opacity: elenaQuoteOpacity, y: elenaQuoteY },
    stats: { opacity: elenaStatsOpacity, y: elenaStatsY },
    portrait: { opacity: elenaPortraitOpacity, y: elenaPortraitY },
  };

  return (
    <div ref={wrapperRef} className="relative">
      <motion.section
        ref={sectionRef}
        id="coaches"
        className="relative z-20 min-h-screen overflow-hidden bg-canvas md:min-h-[180vh]"
        style={{ y: cinematic ? stackY : 0 }}
      >
        {/* Section number — top-right, persistent */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2.5 md:right-12 md:top-8">
          <span aria-hidden="true" className="h-px w-7 bg-fg-muted" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted md:text-xs">
            003 / COACHES
          </span>
        </div>

        {/* Left margin accent bar */}
        <div
          aria-hidden="true"
          className="absolute bottom-[25%] left-0 top-[25%] z-10 hidden w-[2px] bg-accent md:block"
        />

        {/* Vertical type — right edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:block"
        >
          MEET THE PEOPLE — IN THE TRENCHES SINCE 2017
        </div>

        {/* Frame A — Vince */}
        <motion.div
          className="relative flex w-full items-center px-6 py-12 md:sticky md:top-0 md:h-screen md:px-12 md:py-16"
          style={{ opacity: cinematic ? vinceFrameOpacity : 1 }}
        >
          <CoachBlock
            data={VINCE}
            flipped={false}
            reveals={vinceReveals}
            cinematic={cinematic}
          />
        </motion.div>

        {/* Frame B — Elena */}
        <motion.div
          className="relative flex w-full items-center px-6 py-12 md:sticky md:top-0 md:h-screen md:px-12 md:py-16"
          style={{ opacity: cinematic ? elenaFrameOpacity : 1 }}
        >
          <CoachBlock
            data={ELENA}
            flipped={true}
            reveals={elenaReveals}
            cinematic={cinematic}
          />
        </motion.div>
      </motion.section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CoachBlock                                                        */
/* ------------------------------------------------------------------ */

function CoachBlock({
  data,
  flipped,
  reveals,
  cinematic,
}: {
  data: CoachData;
  flipped: boolean;
  reveals: Reveals;
  cinematic: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
      {/* Portrait — always first in DOM (mobile order), flipped on desktop via order classes */}
      <div className={`md:col-span-5 ${flipped ? "md:order-1" : "md:order-2"}`}>
        <CoachPortrait
          src={data.imageSrc}
          label={data.imageLabel}
          subjectLabel={data.subjectLabel}
          opacity={reveals.portrait.opacity}
          y={reveals.portrait.y}
          cinematic={cinematic}
        />
      </div>

      {/* Text column */}
      <div className={`md:col-span-7 ${flipped ? "md:order-2" : "md:order-1"}`}>
        {/* Mono number + name + role */}
        <motion.div
          className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted md:text-xs"
          style={{
            opacity: cinematic ? reveals.name.opacity : 1,
          }}
        >
          {data.number} /{" "}
          {data.nameLines
            .map((l) => l.text.toUpperCase().replace(/\./g, ""))
            .join(" ")}{" "}
          · {data.role}
        </motion.div>

        {/* Italic display name — scroll-bound reveal at the h2 level */}
        <motion.h2
          className="font-medium text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            opacity: cinematic ? reveals.name.opacity : 1,
            y: cinematic ? reveals.name.y : 0,
          }}
        >
          {data.nameLines.map((line, i) => (
            <span key={`${data.number}-${i}`} className="block">
              {line.text}
            </span>
          ))}
        </motion.h2>

        {/* Bio */}
        <motion.p
          className="mt-8 max-w-[44ch] text-base leading-relaxed text-fg md:text-lg"
          style={{
            opacity: cinematic ? reveals.bio.opacity : 1,
            y: cinematic ? reveals.bio.y : 0,
          }}
        >
          {data.bio}
        </motion.p>

        {/* Pull quote */}
        <motion.figure
          className="my-10 max-w-[26ch] border-l-2 border-accent pl-5"
          style={{
            opacity: cinematic ? reveals.quote.opacity : 1,
            y: cinematic ? reveals.quote.y : 0,
          }}
        >
          <blockquote
            className="text-2xl leading-tight text-fg-muted md:text-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
            }}
          >
            {data.quote}
          </blockquote>
          <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            {data.attribution}
          </figcaption>
        </motion.figure>

        {/* Stats — 3 tiles, single scroll-bound reveal */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6"
          style={{
            opacity: cinematic ? reveals.stats.opacity : 1,
            y: cinematic ? reveals.stats.y : 0,
          }}
        >
          {data.stats.map((stat, i) => (
            <div key={i}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted md:text-xs">
                {stat.label}
              </div>
              <div
                className="mb-3 leading-none text-fg"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(3rem, 5vw, 4rem)",
                }}
              >
                {stat.value}
              </div>
              <div aria-hidden="true" className="h-px w-12 bg-accent" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CoachPortrait                                                     */
/* ------------------------------------------------------------------ */

function CoachPortrait({
  src,
  label,
  subjectLabel,
  opacity,
  y,
  cinematic,
}: {
  src: string;
  label: string;
  subjectLabel: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  cinematic: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      className="relative aspect-[4/5] overflow-hidden border border-fg/15 bg-canvas-elevated will-change-transform"
      style={{
        opacity: cinematic ? opacity : 1,
        y: cinematic ? y : 0,
      }}
    >
      {!failed && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}

      {/* Outside-left mono label */}
      <span className="absolute -left-14 top-3 hidden font-mono text-xs uppercase tracking-[0.2em] text-concrete md:inline">
        {label}
      </span>

      {/* Inside-frame mono label */}
      <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
        {subjectLabel}
      </div>
    </motion.div>
  );
}
