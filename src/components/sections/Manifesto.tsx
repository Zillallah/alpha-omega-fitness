"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Manifesto() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const fadeUp = (delay: number = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="manifesto"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-canvas py-24 md:py-32"
    >
      {/* Top-left tactical eyebrow */}
      <div className="absolute left-8 top-8 z-10 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted md:left-12">
        — MANIFESTO
      </div>

      {/* Top-right section number */}
      <div className="absolute right-8 top-8 z-10 flex items-center gap-2.5 md:right-12">
        <div className="h-px w-7 bg-fg-muted" />
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
          002 / MANIFESTO
        </span>
      </div>

      {/* Left vertical accent bar */}
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 left-0 top-1/4 z-10 hidden w-[2px] bg-accent md:block"
      />

      {/* Right vertical type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:block"
      >
        WHAT WE ARE — WHO WE COACH
      </div>

      {/* Main content stack */}
      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 md:px-12">
        {/* Statement 1 — the punch */}
        <motion.h2
          {...fadeUp(0.1)}
          className="font-medium text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.75rem, 8vw, 7rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
          }}
        >
          This isn&apos;t a{" "}
          <span className="relative inline-block">
            gym.
            <motion.span
              aria-hidden="true"
              initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.6,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -left-[2px] -right-[2px] bottom-[10px] z-[-1] h-[12px] origin-left bg-accent"
            />
          </span>
        </motion.h2>

        {/* Statement 2 — the philosophy */}
        <motion.h2
          {...fadeUp(0.3)}
          className="mt-12 font-medium text-fg md:mt-16"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.25rem, 6.5vw, 5.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
          }}
        >
          It&apos;s a{" "}
          <span className="relative inline-block">
            system.
            <motion.span
              aria-hidden="true"
              initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.8,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -left-[2px] -right-[2px] bottom-[8px] z-[-1] h-[10px] origin-left bg-accent"
            />
          </span>
        </motion.h2>

        {/* Statement 3 — the inclusion */}
        <motion.h2
          {...fadeUp(0.5)}
          className="mt-10 font-medium text-fg md:mt-14"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
          }}
        >
          Built for <span className="text-accent">every body.</span>
        </motion.h2>

        {/* Manifesto body prose */}
        <motion.div
          {...fadeUp(0.7)}
          className="mt-16 max-w-[42ch] space-y-4 text-base leading-relaxed text-fg-muted md:mt-20 md:space-y-5 md:text-lg"
        >
          <p>Most gyms sell a membership. We coach a process.</p>
          <p>
            Eight years coaching boot-camp groups in Victorville means
            we&apos;ve seen every level — beginners scared they&apos;ll be the
            slowest, athletes peaking for competitions, returners after
            injuries, parents fitting workouts between work and the school
            run.
          </p>
          <p>
            Every workout has modifications built in because every body needs
            them. Show up. We handle the rest.
          </p>
        </motion.div>

        {/* Bottom GPS + attribution */}
        <motion.div
          {...fadeUp(0.9)}
          className="mt-16 flex flex-col gap-3 md:mt-20 md:flex-row md:items-center md:gap-6"
        >
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-concrete">
            — 34.5362°N · 117.2906°W · ALPHA OMEGA FITNESS
          </div>
          <div
            aria-hidden="true"
            className="hidden h-px flex-1 bg-fg-muted/30 md:block"
          />
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            — THE METHOD · 8 YEARS RUNNING
          </div>
        </motion.div>
      </div>

      {/* Bottom-right scroll cue */}
      <motion.div
        {...fadeUp(1.1)}
        className="absolute bottom-8 right-8 z-10 flex items-center gap-2 md:right-12"
      >
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
          003 / WHO WE ARE →
        </span>
      </motion.div>
    </section>
  );
}
