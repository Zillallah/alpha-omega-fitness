"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Manifesto — Batch 2.4 / section 002.
 * Four-act sticky cinematic. Video fills the entire viewport (full-bleed)
 * during Acts II–IV. CornerBrackets anchor to viewport corners, not the
 * scaling video. Video is scrubbed by scroll position (no play loop).
 *
 * Acts (across 200vh of scroll):
 *   I   0.00 → 0.20 — video scales 0.4 → 1.0, fades in
 *   II  0.20 → 0.45 — video scrubs through its 8s sequence; Statement 1
 *   III 0.45 → 0.85 — video holds on last frame; Statements 2/3 crossfade
 *   IV  0.85 → 1.00 — yellow exit rule + "003 / WHO WE ARE →" pointer;
 *                     Statement 4 ("Show up. We handle the rest.")
 *
 * Mobile: vertical stack of all four statements with autoplay-once video.
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  /* ---- Act I — video approach (0 → 0.20) ---- */
  const videoScale = useTransform(smooth, [0, 0.2], [0.4, 1.0]);
  const videoOpacity = useTransform(smooth, [0, 0.1], [0, 1]);

  /* ---- Dark overlay — gradual increase keeps type readable ---- */
  const videoOverlayOpacity = useTransform(
    smooth,
    [0.25, 0.5, 0.85],
    [0, 0.4, 0.55]
  );

  /* ---- Corner brackets reveal — viewport-anchored, fade in late Act I ---- */
  const bracketsOpacity = useTransform(smooth, [0.2, 0.3], [0, 1]);

  /* ---- Act II — Statement 1 (This isn't a gym.) ---- */
  const s1Opacity = useTransform(
    smooth,
    [0.25, 0.32, 0.42, 0.48],
    [0, 1, 1, 0]
  );
  const s1Y = useTransform(smooth, [0.25, 0.32], [60, 0]);
  const s1StrikeScaleX = useTransform(smooth, [0.32, 0.42], [0, 1]);

  /* ---- Act III a — Statement 2 (It's a system.) ---- */
  const s2Opacity = useTransform(
    smooth,
    [0.48, 0.54, 0.62, 0.68],
    [0, 1, 1, 0]
  );
  const s2Y = useTransform(smooth, [0.48, 0.54], [40, 0]);
  const s2StrikeScaleX = useTransform(smooth, [0.54, 0.62], [0, 1]);

  /* ---- Act III b — Statement 3 (Built for every body.) ---- */
  const s3Opacity = useTransform(
    smooth,
    [0.65, 0.71, 0.78, 0.84],
    [0, 1, 1, 0]
  );
  const s3Y = useTransform(smooth, [0.65, 0.71], [40, 0]);

  /* ---- Act IV — Statement 4 (Show up. We handle the rest.) ---- */
  const s4Opacity = useTransform(
    smooth,
    [0.82, 0.88, 0.94, 1.0],
    [0, 1, 1, 0]
  );
  const s4Y = useTransform(smooth, [0.82, 0.88], [40, 0]);

  /* ---- Tactical metadata reveal ---- */
  const metadataOpacity = useTransform(smooth, [0.4, 0.5], [0, 1]);

  /* ---- Act IV exit ---- */
  const exitRuleScaleX = useTransform(smooth, [0.92, 0.98], [0, 1]);
  const exitTextOpacity = useTransform(smooth, [0.95, 1.0], [0, 1]);

  /* ---- True scroll-bound video scrub.
     No play() — currentTime is driven directly by scroll position so
     video advances forward, backward, or stops in sync with the user. */
  useMotionValueEvent(smooth, "change", (latest) => {
    const v = videoRef.current;
    if (!v || reducedMotion || videoFailed) return;
    if (!v.paused) v.pause();
    if (!Number.isFinite(v.duration) || v.duration <= 0) return;

    const end = v.duration - 0.1;

    if (latest < 0.2) {
      v.currentTime = 0;
    } else if (latest >= 0.2 && latest <= 0.45) {
      const t = (latest - 0.2) / 0.25;
      v.currentTime = Math.max(0, Math.min(t * end, end));
    } else {
      v.currentTime = Math.max(0, v.duration - 0.05);
    }
  });

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative z-10 min-h-screen overflow-hidden bg-canvas md:min-h-[200vh]"
    >
      {/* ============================================================ */}
      {/*  MOBILE — vertical stack, autoplay-once video                */}
      {/* ============================================================ */}
      <div className="flex flex-col items-start gap-8 px-6 py-16 md:hidden">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
          — MANIFESTO
        </div>

        <div className="relative aspect-video w-full overflow-hidden border border-fg/15 bg-canvas-elevated">
          {!videoFailed ? (
            <video
              src="/video/brand-loop.mp4"
              muted
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden="true"
              className="h-full w-full object-cover"
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-canvas-elevated via-canvas to-canvas-elevated"
            />
          )}
          <CornerBrackets />
        </div>

        <h2
          className="font-medium text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 11vw, 3.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
          }}
        >
          This isn&apos;t a{" "}
          <span className="relative inline-block">
            <span className="relative z-10">gym.</span>
            <span
              aria-hidden="true"
              className="absolute -left-1 -right-1 bottom-[8px] z-0 h-[12px] bg-accent"
            />
          </span>
        </h2>

        <h2
          className="font-medium text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 11vw, 3.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
          }}
        >
          It&apos;s a{" "}
          <span className="relative inline-block">
            <span className="relative z-10">system.</span>
            <span
              aria-hidden="true"
              className="absolute -left-1 -right-1 bottom-[8px] z-0 h-[12px] bg-accent"
            />
          </span>
        </h2>

        <h2
          className="font-medium text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 11vw, 3.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
          }}
        >
          Built for <span className="text-accent">every body</span>.
        </h2>

        <p
          className="text-fg-muted"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 7vw, 2.25rem)",
            lineHeight: 1.05,
          }}
        >
          Show up. We handle the rest.
        </p>

        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
          — THE METHOD · 8 YEARS RUNNING
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-concrete">
          — 34.5362°N · 117.2906°W
        </div>
      </div>

      {/* ============================================================ */}
      {/*  DESKTOP — sticky 4-act cinematic                            */}
      {/* ============================================================ */}
      <div className="hidden md:block">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* --- Full-bleed video layer, scales 0.4 → 1.0 in Act I --- */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-hidden will-change-transform"
            style={{
              scale: reducedMotion ? 1 : videoScale,
              opacity: reducedMotion ? 1 : videoOpacity,
              transformOrigin: "center center",
            }}
          >
            {!videoFailed ? (
              <video
                ref={videoRef}
                src="/video/brand-loop.mp4"
                muted
                loop={false}
                playsInline
                preload="auto"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                onLoadedMetadata={() => {
                  const v = videoRef.current;
                  if (!v || reducedMotion) return;
                  v.pause();
                  v.currentTime = 0;
                }}
                onError={() => setVideoFailed(true)}
              />
            ) : (
              <div className="relative h-full w-full bg-gradient-to-br from-canvas-elevated via-canvas to-canvas-elevated">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  BRAND_LOOP — PENDING
                </div>
              </div>
            )}
          </motion.div>

          {/* --- Dark overlay (sits on top of video, below brackets/text) --- */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-canvas"
            style={{
              opacity: reducedMotion ? 0.4 : videoOverlayOpacity,
            }}
          />

          {/* --- Corner brackets — anchored to viewport, not scaling video --- */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{ opacity: reducedMotion ? 1 : bracketsOpacity }}
          >
            <CornerBrackets />
          </motion.div>

          {/* --- Section number top-right (always visible) --- */}
          <div className="absolute right-8 top-8 z-30 flex items-center gap-2.5 md:right-12">
            <span aria-hidden="true" className="h-px w-7 bg-fg-muted" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              002 / MANIFESTO
            </span>
          </div>

          {/* --- "— MANIFESTO" eyebrow top-left (always visible) --- */}
          <div className="absolute left-8 top-8 z-30 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted md:left-12">
            — MANIFESTO
          </div>

          {/* --- Statement 1: This isn't a gym. --- */}
          <motion.h2
            className="absolute left-8 top-1/2 z-30 max-w-[80vw] -translate-y-1/2 font-medium text-fg md:left-16"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              opacity: reducedMotion ? 0 : s1Opacity,
              y: reducedMotion ? 0 : s1Y,
            }}
          >
            This isn&apos;t a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">gym.</span>
              <motion.span
                aria-hidden="true"
                className="absolute -left-1 -right-1 bottom-[12px] z-0 h-[14px] bg-accent"
                style={{
                  scaleX: reducedMotion ? 1 : s1StrikeScaleX,
                  transformOrigin: "left",
                }}
              />
            </span>
          </motion.h2>

          {/* --- Statement 2: It's a system. --- */}
          <motion.h2
            className="absolute left-8 top-1/2 z-30 max-w-[80vw] -translate-y-1/2 font-medium text-fg md:left-16"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              opacity: reducedMotion ? 0 : s2Opacity,
              y: reducedMotion ? 0 : s2Y,
            }}
          >
            It&apos;s a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">system.</span>
              <motion.span
                aria-hidden="true"
                className="absolute -left-1 -right-1 bottom-[12px] z-0 h-[14px] bg-accent"
                style={{
                  scaleX: reducedMotion ? 1 : s2StrikeScaleX,
                  transformOrigin: "left",
                }}
              />
            </span>
          </motion.h2>

          {/* --- Statement 3: Built for every body. --- */}
          <motion.h2
            className="absolute left-8 top-1/2 z-30 max-w-[80vw] -translate-y-1/2 font-medium text-fg md:left-16"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              opacity: reducedMotion ? 0 : s3Opacity,
              y: reducedMotion ? 0 : s3Y,
            }}
          >
            Built for <span className="text-accent">every body</span>.
          </motion.h2>

          {/* --- Statement 4: Show up. We handle the rest. --- */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              opacity: reducedMotion ? 0 : s4Opacity,
              y: reducedMotion ? 0 : s4Y,
            }}
          >
            <h2
              className="font-medium text-fg"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
              }}
            >
              <span className="block">Show up.</span>
              <span className="block">We handle the rest.</span>
            </h2>
            <div className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              — THE METHOD · 8 YEARS RUNNING
            </div>
          </motion.div>

          {/* --- Tactical metadata block (bottom-left) --- */}
          <motion.div
            className="absolute bottom-8 left-8 z-30 space-y-1.5 md:left-12"
            style={{ opacity: reducedMotion ? 1 : metadataOpacity }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              BRAND_LOOP · 00:00:08
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              — 34.5362°N · 117.2906°W
            </div>
          </motion.div>

          {/* --- REC indicator --- */}
          <motion.div
            className="absolute right-8 top-16 z-30 flex items-center gap-2 md:right-12"
            style={{ opacity: reducedMotion ? 1 : metadataOpacity }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              REC
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse bg-accent"
            />
          </motion.div>

          {/* --- Act IV exit rule --- */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-20 left-8 right-8 z-30 h-px bg-accent md:left-12 md:right-12"
            style={{
              scaleX: reducedMotion ? 0 : exitRuleScaleX,
              transformOrigin: "left",
            }}
          />

          {/* --- Act IV exit pointer text --- */}
          <motion.div
            className="absolute bottom-12 left-8 z-30 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted md:left-12"
            style={{ opacity: reducedMotion ? 0 : exitTextOpacity }}
          >
            — 003 / WHO WE ARE [VINCE &amp; ELENA] →
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Tactical L-bracket corners — viewport anchored when wrapped in absolute inset-0. */
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
