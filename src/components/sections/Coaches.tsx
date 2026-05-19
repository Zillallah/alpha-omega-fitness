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

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

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
 * Coaches — Batch 2 / section 003.
 * 240vh: two sticky frames cross-fade at scrollYProgress 0.5.
 * Vince's portrait sits right (text left); Elena's portrait sits left
 * (text right) — asymmetric flip emphasizes partnership.
 * Mobile (< 768px): no sticky, both coaches stack normally.
 */
export default function Coaches() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const vinceOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);
  const elenaOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const vincePortraitY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);
  const elenaPortraitY = useTransform(scrollYProgress, [0.5, 1], [0, -40]);

  const cinematic = !isMobile && !reducedMotion;

  return (
    <section
      ref={sectionRef}
      id="coaches"
      className="relative min-h-screen overflow-hidden bg-canvas md:min-h-[180vh]"
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
        className="relative flex w-full items-center py-20 md:sticky md:top-0 md:h-screen md:py-0"
        style={{ opacity: cinematic ? vinceOpacity : 1 }}
      >
        <CoachBlock
          data={VINCE}
          flipped={false}
          portraitY={vincePortraitY}
          reducedMotion={reducedMotion}
          cinematic={cinematic}
        />
      </motion.div>

      {/* Frame B — Elena */}
      <motion.div
        className="relative flex w-full items-center py-20 md:sticky md:top-0 md:h-screen md:py-0"
        style={{ opacity: cinematic ? elenaOpacity : 1 }}
      >
        <CoachBlock
          data={ELENA}
          flipped={true}
          portraitY={elenaPortraitY}
          reducedMotion={reducedMotion}
          cinematic={cinematic}
        />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CoachBlock                                                        */
/* ------------------------------------------------------------------ */

function CoachBlock({
  data,
  flipped,
  portraitY,
  reducedMotion,
  cinematic,
}: {
  data: CoachData;
  flipped: boolean;
  portraitY: MotionValue<number>;
  reducedMotion: boolean;
  cinematic: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-12 md:px-12">
      {/* Portrait — always first in DOM (mobile order), flipped on desktop via order classes */}
      <div
        className={`md:col-span-5 ${flipped ? "md:order-1" : "md:order-2"}`}
      >
        <CoachPortrait
          src={data.imageSrc}
          label={data.imageLabel}
          subjectLabel={data.subjectLabel}
          y={portraitY}
          cinematic={cinematic}
        />
      </div>

      {/* Text column */}
      <div
        className={`md:col-span-7 ${flipped ? "md:order-2" : "md:order-1"}`}
      >
        {/* Mono number + name + role, e.g. "001 / VINCE GREENE · OWNER + LEAD COACH" */}
        <motion.div
          className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted md:text-xs"
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-300px" }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.6 }}
        >
          {data.number} /{" "}
          {data.nameLines
            .map((l) => l.text.toUpperCase().replace(/\./g, ""))
            .join(" ")}{" "}
          · {data.role}
        </motion.div>

        {/* Italic display name */}
        <h2
          className="mt-6 font-medium text-fg md:mt-8"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
          }}
        >
          {data.nameLines.map((line, i) => (
            <motion.span
              key={`${data.number}-${i}`}
              className="block"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, x: line.vector.x, y: line.vector.y }
              }
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-300px" }}
              transition={{
                duration: 1.0,
                delay: reducedMotion ? 0 : 0.6 + i * 0.08,
                ease: REVEAL_EASE,
              }}
            >
              {line.text}
            </motion.span>
          ))}
        </h2>

        {/* Bio */}
        <motion.p
          className="mt-8 max-w-[44ch] text-base leading-relaxed text-fg md:text-lg"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-300px" }}
          transition={{ duration: 0.8, delay: reducedMotion ? 0 : 0.6 }}
        >
          {data.bio}
        </motion.p>

        {/* Pull quote */}
        <motion.figure
          className="my-10 max-w-[26ch] border-l-2 border-accent pl-5"
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-300px" }}
          transition={{ duration: 0.8, delay: reducedMotion ? 0 : 0.7 }}
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

        {/* Stats — 3 tiles */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {data.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-300px" }}
              transition={{
                duration: 0.7,
                delay: reducedMotion ? 0 : 0.9 + i * 0.1,
              }}
            >
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
            </motion.div>
          ))}
        </div>
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
  y,
  cinematic,
}: {
  src: string;
  label: string;
  subjectLabel: string;
  y: MotionValue<number>;
  cinematic: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      className="relative aspect-[4/5] overflow-hidden border border-fg/15 bg-canvas-elevated will-change-transform"
      initial={cinematic ? { opacity: 0, y: 60 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-300px" }}
      transition={{ duration: 1.0, delay: cinematic ? 0.6 : 0, ease: REVEAL_EASE }}
      style={{ y: cinematic ? y : 0 }}
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

      {/* Inside-frame mono labels */}
      <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
        {subjectLabel}
      </div>
    </motion.div>
  );
}
