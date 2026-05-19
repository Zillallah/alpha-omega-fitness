"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Manifesto — Batch 2.6 / section 002.
 * "Private screening" pattern: black canvas, video framed cinematically
 * in the center like a movie screen, sticky-pinned for ~4s of intentional
 * viewing time. Video plays in real time (not scroll-scrubbed). Statements
 * overlay the video using mix-blend-difference, then the section exits.
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Cinema frame entrance — appears as section enters viewport
  const frameOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const frameScale = useTransform(scrollYProgress, [0, 0.1], [0.92, 1]);

  // Statement appears over the video as it plays
  const statementOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.32, 0.55, 0.62],
    [0, 1, 1, 0]
  );
  const statementY = useTransform(scrollYProgress, [0.25, 0.32], [40, 0]);

  // Manifesto body reveal
  const bodyOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.45, 0.55], [40, 0]);

  // Exit indicator
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

  // Auto-play video when section enters viewport
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative z-10 min-h-screen overflow-hidden bg-canvas md:min-h-[500vh]"
    >
      {/* Sticky cinema frame — pins centered for the full section duration */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden pt-[20vh]">
        {/* Background canvas */}
        <div aria-hidden="true" className="absolute inset-0 bg-canvas" />

        {/* Top-left tactical eyebrow */}
        <div className="absolute left-8 top-8 z-30 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted md:left-12">
          — MANIFESTO
        </div>

        {/* Top-right section number */}
        <div className="absolute right-8 top-8 z-30 flex items-center gap-2.5 md:right-12">
          <div className="h-px w-7 bg-fg-muted" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            002 / MANIFESTO
          </span>
        </div>

        {/* Vertical type on left edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-concrete md:block"
        >
          PRIVATE SCREENING — INTENTIONALLY HELD
        </div>

        {/* THE CINEMA FRAME — centered movie screen */}
        <motion.div
          className="relative aspect-video w-[88vw] max-w-[1100px]"
          style={{
            opacity: reducedMotion ? 1 : frameOpacity,
            scale: reducedMotion ? 1 : frameScale,
          }}
        >
          {/* Tactical corner brackets — frame the screen */}
          <CornerBracket position="top-left" />
          <CornerBracket position="top-right" />
          <CornerBracket position="bottom-left" />
          <CornerBracket position="bottom-right" />

          {/* The video itself */}
          <video
            ref={videoRef}
            src="/video/brand-loop.mp4"
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] bg-black object-cover"
          />

          {/* REC indicator top-right inside frame */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              REC
            </span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          </div>

          {/* Brand loop label bottom-left inside frame */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              BRAND_LOOP · 00:00:08
            </div>
          </div>

          {/* GPS coords bottom-right inside frame */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              34.5362°N · 117.2906°W
            </div>
          </div>
        </motion.div>

        {/* Statement overlays the video using mix-blend-difference */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 top-1/2 z-20 -translate-y-1/2 px-8 md:px-16"
          style={{
            opacity: reducedMotion ? 0 : statementOpacity,
            y: reducedMotion ? 0 : statementY,
          }}
        >
          <h2
            className="text-center font-medium text-fg mix-blend-difference"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            This isn&apos;t a{" "}
            <span className="relative inline-block">
              gym.
              <span
                aria-hidden="true"
                className="absolute -left-[2px] -right-[2px] bottom-[10px] z-[-1] h-[12px] bg-accent"
              />
            </span>
          </h2>
        </motion.div>

        {/* Manifesto body anchored bottom-left */}
        <motion.div
          className="absolute bottom-20 left-8 z-20 max-w-[44ch] md:left-12"
          style={{
            opacity: reducedMotion ? 1 : bodyOpacity,
            y: reducedMotion ? 0 : bodyY,
          }}
        >
          <p
            className="text-xl leading-tight text-fg md:text-2xl"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
            }}
          >
            It&apos;s a <span className="text-accent">system.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
            Eight years. Every level. Modifications built into every workout.
            <br />
            Show up. We handle the rest.
          </p>
        </motion.div>

        {/* Exit cue — bottom-right */}
        <motion.div
          className="absolute bottom-8 right-8 z-30 flex items-center gap-3 md:right-12"
          style={{ opacity: reducedMotion ? 1 : exitOpacity }}
        >
          <div className="h-px w-12 bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            003 / WHO WE ARE →
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/** Tactical corner bracket — sits just outside the cinema frame edge. */
function CornerBracket({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const armBase = "absolute h-6 w-6 border-accent z-10";
  const positions: Record<typeof position, string> = {
    "top-left": "-left-2 -top-2 border-l-2 border-t-2",
    "top-right": "-right-2 -top-2 border-r-2 border-t-2",
    "bottom-left": "-bottom-2 -left-2 border-b-2 border-l-2",
    "bottom-right": "-bottom-2 -right-2 border-b-2 border-r-2",
  };
  return (
    <div aria-hidden="true" className={`${armBase} ${positions[position]}`} />
  );
}
