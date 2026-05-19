"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Manifesto — Batch 2 / section 002.
 * 200vh sticky pause anchored by the brand video.
 * Reads correctly even without the video asset present.
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  // Play only when the video frame is in view — saves cycles + bandwidth
  const isInView = useInView(videoRef, { margin: "-20%", once: false });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore — happens if the source isn't ready yet */
      }
      return;
    }
    if (isInView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isInView, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative flex min-h-screen items-center overflow-hidden bg-canvas py-20 md:py-0"
    >
        {/* Section number — top-right */}
        <div className="absolute right-4 top-4 hidden items-center gap-2.5 sm:flex md:right-12 md:top-8">
          <span aria-hidden="true" className="h-px w-7 bg-fg-muted" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted md:text-xs">
            002 / MANIFESTO
          </span>
        </div>

        {/* Left margin yellow accent bar */}
        <div
          aria-hidden="true"
          className="absolute bottom-[25%] left-0 top-[25%] hidden w-[2px] bg-accent md:block"
        />

        {/* Vertical type running up right edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:block"
        >
          WHAT WE ARE — WHO WE COACH
        </div>

        {/* Composition grid */}
        <div className="grid w-full grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-12 md:px-12">
          {/* Left text column */}
          <div className="md:col-span-7">
            <motion.div
              className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted"
              initial={reducedMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              — MANIFESTO
            </motion.div>

            {/* H2 — italic with yellow strike on "system." */}
            <h2
              className="font-medium text-fg"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(2.75rem, 7vw, 6rem)",
                letterSpacing: "-0.035em",
                lineHeight: 0.92,
              }}
            >
              <motion.span
                className="block"
                initial={reducedMotion ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.9, ease: REVEAL_EASE }}
              >
                This isn&apos;t a gym.
              </motion.span>
              <motion.span
                className="block"
                initial={reducedMotion ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.9, delay: 0.12, ease: REVEAL_EASE }}
              >
                It&apos;s a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">system.</span>
                  <motion.span
                    aria-hidden="true"
                    className="absolute -left-1 -right-1 bottom-[10px] z-0 h-[11px] bg-accent"
                    initial={
                      reducedMotion
                        ? { scaleX: 1, transformOrigin: "left" }
                        : { scaleX: 0, transformOrigin: "left" }
                    }
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      delay: reducedMotion ? 0 : 0.4,
                      duration: reducedMotion ? 0 : 0.7,
                      ease: REVEAL_EASE,
                    }}
                  />
                </span>
              </motion.span>
            </h2>

            {/* Manifesto prose */}
            <div className="mt-10 max-w-[36ch] space-y-6">
              <motion.p
                className="text-base leading-relaxed text-fg-muted md:text-lg"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: reducedMotion ? 0 : 0.6 }}
              >
                Most gyms sell a membership. We coach a process.
              </motion.p>
              <motion.p
                className="text-base leading-relaxed text-fg-muted md:text-lg"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: reducedMotion ? 0 : 0.75 }}
              >
                Eight years coaching boot-camp groups in Victorville means
                we&apos;ve seen every level — beginners scared they&apos;ll be
                the slowest, athletes peaking for competitions, returners after
                injuries, parents fitting workouts between work and the school
                run. Every workout has modifications built in because every
                body needs them. Show up. We handle the rest.
              </motion.p>
            </div>

            {/* GPS */}
            <motion.div
              className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-concrete"
              initial={reducedMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : 1.0 }}
            >
              — 34.5362°N · 117.2906°W · ALPHA OMEGA FITNESS
            </motion.div>
          </div>

          {/* Right video column */}
          <div className="md:col-span-5">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden border border-fg/15 bg-canvas-elevated"
              initial={reducedMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: REVEAL_EASE }}
            >
              {!videoFailed ? (
                <video
                  ref={videoRef}
                  src="/video/brand-loop.mp4"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={() => setVideoFailed(true)}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-canvas-elevated via-canvas to-canvas-elevated"
                />
              )}

              <CornerBrackets />

              <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {videoFailed ? "BRAND_LOOP — PENDING" : "BRAND_LOOP · 00:00:08"}
              </div>
              <div className="absolute right-3 top-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                REC
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 animate-pulse bg-accent"
                />
              </div>
            </motion.div>
          </div>
        </div>
    </section>
  );
}

/** Tactical L-bracket corners around the video frame. */
function CornerBrackets() {
  const arms = "w-5 h-5 border-accent";
  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute left-2 top-2 ${arms} border-l-[1.5px] border-t-[1.5px]`}
      />
      <div
        aria-hidden="true"
        className={`absolute right-2 top-2 ${arms} border-r-[1.5px] border-t-[1.5px]`}
      />
      <div
        aria-hidden="true"
        className={`absolute bottom-2 left-2 ${arms} border-b-[1.5px] border-l-[1.5px]`}
      />
      <div
        aria-hidden="true"
        className={`absolute bottom-2 right-2 ${arms} border-b-[1.5px] border-r-[1.5px]`}
      />
    </>
  );
}
