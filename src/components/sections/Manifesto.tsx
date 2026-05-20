"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Manifesto — Batch 2.6.2 / section 002.
 * Type-driven with the brand video as a BACKGROUND WATERMARK (low opacity,
 * anchored bottom-center, like the Hero's "08" watermark). The italic
 * statements are the focal point; the video provides texture, not focus.
 * Sticky-pinned for 400vh so the video loops several times while the user
 * reads.
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

  /* ---- Top-level useTransforms (hooks must be at component top) ---- */

  // Watermark video — fades in early, holds, fades down at exit
  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.85, 1.0],
    [0, 0.18, 0.18, 0.08]
  );

  // Statement 1 — "This isn't a gym." (delayed so video gets solo airtime first)
  const s1Opacity = useTransform(scrollYProgress, [0.18, 0.28], [0, 1]);
  const s1Y = useTransform(scrollYProgress, [0.18, 0.28], [40, 0]);
  const s1Strike = useTransform(scrollYProgress, [0.25, 0.33], [0, 1]);

  // Statement 2 — "It's a system."
  const s2Opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const s2Y = useTransform(scrollYProgress, [0.3, 0.4], [40, 0]);
  const s2Strike = useTransform(scrollYProgress, [0.38, 0.46], [0, 1]);

  // Statement 3 — "Built for every body."
  const s3Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const s3Y = useTransform(scrollYProgress, [0.5, 0.6], [40, 0]);

  // Manifesto body prose
  const bodyOpacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.62, 0.72], [30, 0]);

  // Bottom-left tactical metadata
  const metaOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  // Exit cue bottom-right
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.88], [0, 1]);

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
      className="relative z-10 min-h-screen bg-canvas md:min-h-[175vh]"
    >
      {/* Sticky frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background watermark VIDEO — anchored bottom-center, low opacity */}
        <motion.div
          className="pointer-events-none absolute"
          style={{
            left: "50%",
            bottom: "5vh",
            transform: "translateX(-50%)",
            width: "min(70vw, 900px)",
            opacity: reducedMotion ? 0.18 : videoOpacity,
            zIndex: 0,
          }}
        >
          <video
            ref={videoRef}
            src="/video/brand-loop.mp4"
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="h-auto w-full"
          />
        </motion.div>

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
          WHAT WE ARE — WHO WE COACH
        </div>

        {/* MAIN TYPE — focal point, in front of watermark video */}
        <div className="relative z-20 flex h-full items-center px-6 pt-[15vh] md:px-12 md:pt-[20vh]">
          <div className="mx-auto w-full max-w-[1100px]">
            {/* Statement 1 */}
            <motion.h2
              className="font-medium text-fg"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(2.75rem, 8vw, 7rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                opacity: reducedMotion ? 1 : s1Opacity,
                y: reducedMotion ? 0 : s1Y,
              }}
            >
              This isn&apos;t a{" "}
              <span className="relative inline-block">
                gym.
                <motion.span
                  aria-hidden="true"
                  className="absolute -left-[2px] -right-[2px] bottom-[10px] z-[-1] h-[12px] origin-left bg-accent"
                  style={{
                    scaleX: reducedMotion ? 1 : s1Strike,
                  }}
                />
              </span>
            </motion.h2>

            {/* Statement 2 */}
            <motion.h2
              className="mt-10 font-medium text-fg md:mt-14"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(2.25rem, 6.5vw, 5.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                opacity: reducedMotion ? 1 : s2Opacity,
                y: reducedMotion ? 0 : s2Y,
              }}
            >
              It&apos;s a{" "}
              <span className="relative inline-block">
                system.
                <motion.span
                  aria-hidden="true"
                  className="absolute -left-[2px] -right-[2px] bottom-[8px] z-[-1] h-[10px] origin-left bg-accent"
                  style={{
                    scaleX: reducedMotion ? 1 : s2Strike,
                  }}
                />
              </span>
            </motion.h2>

            {/* Statement 3 */}
            <motion.h2
              className="mt-8 font-medium text-fg md:mt-12"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                opacity: reducedMotion ? 1 : s3Opacity,
                y: reducedMotion ? 0 : s3Y,
              }}
            >
              Built for <span className="text-accent">every body.</span>
            </motion.h2>

            {/* Manifesto body prose */}
            <motion.div
              className="mt-12 max-w-[42ch] space-y-3 text-base leading-relaxed text-fg-muted md:mt-16 md:text-lg"
              style={{
                opacity: reducedMotion ? 1 : bodyOpacity,
                y: reducedMotion ? 0 : bodyY,
              }}
            >
              <p>
                Eight years. Every level. Modifications built into every
                workout.
              </p>
              <p>Show up. We handle the rest.</p>
            </motion.div>
          </div>
        </div>

        {/* Bottom-left tactical metadata */}
        <motion.div
          className="absolute bottom-8 left-8 z-30 font-mono text-xs uppercase tracking-[0.22em] text-concrete md:left-12"
          style={{
            opacity: reducedMotion ? 1 : metaOpacity,
          }}
        >
          — 34.5362°N · 117.2906°W · BRAND_LOOP · 00:00:08
        </motion.div>

        {/* Exit cue bottom-right */}
        <motion.div
          className="absolute bottom-8 right-8 z-30 flex items-center gap-3 md:right-12"
          style={{
            opacity: reducedMotion ? 1 : exitOpacity,
          }}
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
