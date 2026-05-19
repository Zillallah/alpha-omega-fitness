"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Marquee from "@/components/sections/Marquee";

/* ------------------------------------------------------------------ */
/*  Photo collage spec — seven physically-arranged frames.            */
/*  Positions/sizes are tuned for desktop; only layer 1 renders mobile. */
/* ------------------------------------------------------------------ */

type LayerSpec = {
  label: string;
  src: string;
  /** Tailwind position classes (desktop). */
  position: string;
  /** Pixel size: [width, height]. */
  size: [number, number];
  /** scroll-bound y range, in px. */
  yRange: [number, number];
  /** scroll-bound rotate range, in deg. */
  rotateRange: [number, number];
  /** Border opacity 0-1, baked into a Tailwind arbitrary value. */
  borderClass: string;
  /** Optional scale range. */
  scaleRange?: [number, number];
  /** True = visible on mobile too. */
  mobile?: boolean;
};

const LAYERS: LayerSpec[] = [
  {
    label: "_01",
    src: "/images/hero/hero-1.jpg",
    position: "right-[15%] top-[12%]",
    size: [280, 210],
    yRange: [0, -100],
    rotateRange: [0, 1.5],
    scaleRange: [1, 1.06],
    borderClass: "border-fg/10",
    mobile: true,
  },
  {
    label: "_02",
    src: "/images/hero/hero-2.jpg",
    position: "right-[3%] top-[28%]",
    size: [220, 165],
    yRange: [0, -180],
    rotateRange: [0, -1],
    borderClass: "border-fg/15",
  },
  {
    label: "_03",
    src: "/images/hero/hero-3.jpg",
    position: "left-[55%] top-[55%]",
    size: [180, 135],
    yRange: [0, -240],
    rotateRange: [0, -1],
    borderClass: "border-fg/20",
  },
  {
    label: "_04",
    src: "/images/hero/hero-4.jpg",
    position: "right-[8%] bottom-[18%]",
    size: [200, 150],
    yRange: [0, -300],
    rotateRange: [0, 1.5],
    borderClass: "border-fg/25",
  },
  {
    label: "_05",
    src: "/images/hero/hero-5.jpg",
    position: "left-[48%] bottom-[8%]",
    size: [140, 105],
    yRange: [0, -360],
    rotateRange: [0, -1],
    borderClass: "border-fg/30",
  },
  {
    label: "_06",
    src: "/images/hero/hero-6.jpg",
    position: "right-[28%] top-[3%]",
    size: [100, 75],
    yRange: [0, -80],
    rotateRange: [0, -1],
    borderClass: "border-fg/15",
  },
  {
    label: "_07",
    src: "/images/hero/hero-7.jpg",
    position: "left-[62%] top-[18%]",
    size: [120, 90],
    yRange: [0, -160],
    rotateRange: [0, 1.5],
    borderClass: "border-fg/20",
  },
];

/* ------------------------------------------------------------------ */
/*  H1 word-vector entry variants                                     */
/* ------------------------------------------------------------------ */

const lineVariants: Variants = {
  hidden: (custom: { x: number; y: number }) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Reduced-motion hook                                               */
/* ------------------------------------------------------------------ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  /* ---- Top-level scroll-bound transforms (must be at component top) ---- */

  // Yellow vertical accent bar — height grows through Frame 1
  const barHeight = useTransform(
    scrollYProgress,
    [0, 0.33, 1.0],
    ["20px", "240px", "240px"]
  );

  // Watermark "08" — subtle zoom + opacity build
  const watermarkScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const watermarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1.0],
    [0.04, 0.04, 0.06, 0.06]
  );

  // H1 — Frame 2 settles slightly, Frame 3 shrinks to nav badge in top-right
  const h1Scale = useTransform(
    scrollYProgress,
    [0.33, 0.66, 1.0],
    [1, 0.85, 0.18]
  );
  const h1Y = useTransform(
    scrollYProgress,
    [0.33, 0.66, 1.0],
    ["0vh", "-3vh", "-15vh"]
  );
  const h1X = useTransform(
    scrollYProgress,
    [0.66, 1.0],
    ["0vw", "75vw"]
  );

  // Scroll progress rail indicator dot — tracks smoothProgress
  const railIndicatorTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Scroll cue fades out very early
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Marquee strip slides up from below during Frame 2
  const marqueeY = useTransform(scrollYProgress, [0.3, 0.4], [120, 0]);
  const marqueeOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);

  // Photo collage uniform fade in Frame 3 tail
  const collageOpacity = useTransform(
    scrollYProgress,
    [0.85, 1.0],
    [1, 0.3]
  );

  /* ---- Per-layer photo transforms — declared at top level, one per layer ---- */

  const l1Y = useTransform(scrollYProgress, [0, 1], LAYERS[0].yRange);
  const l1R = useTransform(scrollYProgress, [0, 1], LAYERS[0].rotateRange);
  const l1S = useTransform(scrollYProgress, [0, 1], LAYERS[0].scaleRange ?? [1, 1]);

  const l2Y = useTransform(scrollYProgress, [0, 1], LAYERS[1].yRange);
  const l2R = useTransform(scrollYProgress, [0, 1], LAYERS[1].rotateRange);
  const l2S = useTransform(scrollYProgress, [0, 1], LAYERS[1].scaleRange ?? [1, 1]);

  const l3Y = useTransform(scrollYProgress, [0, 1], LAYERS[2].yRange);
  const l3R = useTransform(scrollYProgress, [0, 1], LAYERS[2].rotateRange);
  const l3S = useTransform(scrollYProgress, [0, 1], LAYERS[2].scaleRange ?? [1, 1]);

  const l4Y = useTransform(scrollYProgress, [0, 1], LAYERS[3].yRange);
  const l4R = useTransform(scrollYProgress, [0, 1], LAYERS[3].rotateRange);
  const l4S = useTransform(scrollYProgress, [0, 1], LAYERS[3].scaleRange ?? [1, 1]);

  const l5Y = useTransform(scrollYProgress, [0, 1], LAYERS[4].yRange);
  const l5R = useTransform(scrollYProgress, [0, 1], LAYERS[4].rotateRange);
  const l5S = useTransform(scrollYProgress, [0, 1], LAYERS[4].scaleRange ?? [1, 1]);

  const l6Y = useTransform(scrollYProgress, [0, 1], LAYERS[5].yRange);
  const l6R = useTransform(scrollYProgress, [0, 1], LAYERS[5].rotateRange);
  const l6S = useTransform(scrollYProgress, [0, 1], LAYERS[5].scaleRange ?? [1, 1]);

  const l7Y = useTransform(scrollYProgress, [0, 1], LAYERS[6].yRange);
  const l7R = useTransform(scrollYProgress, [0, 1], LAYERS[6].rotateRange);
  const l7S = useTransform(scrollYProgress, [0, 1], LAYERS[6].scaleRange ?? [1, 1]);

  const layerTransforms = [
    { y: l1Y, r: l1R, s: l1S },
    { y: l2Y, r: l2R, s: l2S },
    { y: l3Y, r: l3R, s: l3S },
    { y: l4Y, r: l4R, s: l4S },
    { y: l5Y, r: l5R, s: l5S },
    { y: l6Y, r: l6R, s: l6S },
    { y: l7Y, r: l7R, s: l7S },
  ];

  /* ---- Sticky mobile CTA (Batch 1 carryover) ---- */
  const mobileStickyOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 1],
    [0, 1, 1]
  );

  /* ---- Section number transformer (string switch on scroll) ---- */
  const [sectionLabel, setSectionLabel] = useState("001 / HERO");
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > 0.66 ? "002 / MANIFESTO" : "001 / HERO";
    setSectionLabel((prev) => (prev !== next ? next : prev));
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen md:min-h-[300vh] bg-canvas bg-gradient-to-br from-zinc-950 via-zinc-900 to-black"
    >
      {/* ============================================================ */}
      {/*  STICKY FRAME — pinned for the entire 300vh                  */}
      {/* ============================================================ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* --- (a) Yellow vertical accent bar (left) --- */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-[15%] hidden w-[2px] bg-accent md:block"
          style={{ height: reducedMotion ? "240px" : barHeight }}
        />

        {/* --- (b) Tactical eyebrow (top-left) --- */}
        <motion.div
          className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.22em] text-fg md:left-12 md:top-8 md:text-xs"
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          ALPHA OMEGA · VICTORVILLE · EST. 2017
        </motion.div>

        {/* --- (c) Section number transformer (top-right) --- */}
        <div className="absolute right-6 top-6 flex items-center gap-2.5 md:right-12 md:top-8">
          <span aria-hidden="true" className="h-px w-7 bg-fg-muted" />
          <AnimatePresence mode="wait">
            <motion.span
              key={sectionLabel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted md:text-xs"
            >
              {sectionLabel}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* --- (d) Watermark "08" anchor --- */}
        <motion.div
          aria-hidden="true"
          className="display-italic pointer-events-none absolute left-[5%] top-[8%] hidden text-fg md:block"
          style={{
            fontSize: "clamp(20rem, 40vw, 30rem)",
            scale: reducedMotion ? 1 : watermarkScale,
            opacity: reducedMotion ? 0.04 : watermarkOpacity,
            lineHeight: 1,
          }}
        >
          08
        </motion.div>

        {/* --- (i) Photo collage — 7 layers --- */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: reducedMotion ? 1 : collageOpacity }}
          aria-hidden="true"
        >
          {LAYERS.map((layer, i) => (
            <PhotoLayer
              key={layer.label}
              spec={layer}
              y={layerTransforms[i].y}
              rotate={layerTransforms[i].r}
              scale={layerTransforms[i].s}
              reducedMotion={reducedMotion}
              hideOnMobile={!layer.mobile}
            />
          ))}
        </motion.div>

        {/* --- (e) H1 — choreographed entry + frame 2/3 transforms --- */}
        <motion.div
          className="absolute left-6 top-[18%] z-30 md:left-12"
          style={{
            scale: reducedMotion ? 1 : h1Scale,
            x: reducedMotion ? 0 : h1X,
            y: reducedMotion ? 0 : h1Y,
            transformOrigin: "left top",
          }}
        >
          <h1
            className="display-italic text-fg"
            style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
          >
            {/* Visually three lines, semantically one h1 */}
            <motion.span
              className="block"
              variants={lineVariants}
              custom={{ x: -80, y: 0 }}
              initial={reducedMotion ? "visible" : "hidden"}
              animate="visible"
              transition={{
                delay: reducedMotion ? 0 : 0.6,
                duration: reducedMotion ? 0.6 : 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Group training
            </motion.span>

            <motion.span
              className="block pl-[8vw]"
              variants={lineVariants}
              custom={{ x: 100, y: 0 }}
              initial={reducedMotion ? "visible" : "hidden"}
              animate="visible"
              transition={{
                delay: reducedMotion ? 0 : 0.85,
                duration: reducedMotion ? 0.6 : 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              that gets{" "}
              <span className="relative inline-block">
                <span className="relative z-10">results.</span>
                <motion.span
                  aria-hidden="true"
                  className="absolute -left-1 -right-1 bottom-[12px] z-0 h-[14px] bg-accent"
                  initial={
                    reducedMotion
                      ? { scaleX: 1, transformOrigin: "left" }
                      : { scaleX: 0, transformOrigin: "left" }
                  }
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: reducedMotion ? 0 : 1.4,
                    duration: reducedMotion ? 0 : 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </span>
            </motion.span>

            <motion.span
              className="block pl-[3vw]"
              variants={lineVariants}
              custom={{ x: 0, y: 60 }}
              initial={reducedMotion ? "visible" : "hidden"}
              animate="visible"
              transition={{
                delay: reducedMotion ? 0 : 1.1,
                duration: reducedMotion ? 0.6 : 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              8 <span className="text-accent">years</span> of proof.
            </motion.span>
          </h1>
        </motion.div>

        {/* --- (f) Sub-deck --- */}
        <motion.p
          className="absolute bottom-[28%] left-6 max-w-[380px] text-base leading-relaxed text-fg-muted md:left-12 md:text-lg"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: reducedMotion ? 0 : 1.6,
            duration: reducedMotion ? 0.4 : 0.8,
          }}
        >
          Boot camp coaching with Vince and Elena in Victorville. Beginners
          through athletes. Modifications for every body.
        </motion.p>

        {/* --- (g) GPS coordinates --- */}
        <motion.div
          className="absolute bottom-[22%] left-6 hidden font-mono text-xs uppercase tracking-[0.22em] text-concrete sm:block md:left-12"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: reducedMotion ? 0 : 1.8,
            duration: reducedMotion ? 0.4 : 0.8,
          }}
        >
          — 34.5362°N · 117.2906°W
        </motion.div>

        {/* --- (h) CTA row --- */}
        <motion.div
          className="absolute bottom-[12%] left-6 flex items-center gap-4 md:left-12"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 2.0,
            duration: reducedMotion ? 0.4 : 0.6,
          }}
        >
          <a
            href="#trial"
            className="inline-block bg-accent px-6 py-3.5 font-mono text-xs uppercase tracking-[0.20em] text-canvas transition-colors duration-200 hover:bg-accent-warm md:px-7 md:py-4 md:text-sm"
          >
            Start your free trial week →
          </a>
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-fg-muted md:inline">
            No card · No pressure
          </span>
        </motion.div>

        {/* --- (j) Vertical type — right edge --- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:block"
        >
          VICTORVILLE — CALIFORNIA — HIGH DESERT
        </div>

        {/* --- (k) HYROX badge --- */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2.5 md:bottom-8 md:right-12">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg md:text-xs">
            OFFICIAL HYROX GYM AFFILIATE
          </span>
        </div>

        {/* --- (l) Scroll progress rail --- */}
        <div
          aria-hidden="true"
          className="absolute right-2 top-[20%] bottom-[20%] hidden w-px bg-fg/10 md:block"
        >
          {/* Yellow ticks */}
          {[0.25, 0.5, 0.75, 1].map((p) => (
            <span
              key={p}
              className="absolute -left-[3px] h-px w-2 bg-accent"
              style={{ top: `${p * 100}%`, transform: "translateY(-50%)" }}
            />
          ))}
          {/* Indicator dot */}
          <motion.span
            className="absolute -left-[3px] h-2 w-2 bg-accent"
            style={{
              top: reducedMotion ? "0%" : railIndicatorTop,
              transform: "translateY(-50%)",
            }}
          />
        </div>

        {/* --- (m) Scroll cue (Frame 1 only) --- */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.32em] text-fg-muted md:flex"
          style={{ opacity: reducedMotion ? 0.5 : scrollCueOpacity }}
        >
          <span>SCROLL</span>
          <motion.span
            className="h-7 w-px bg-fg-muted"
            animate={
              reducedMotion
                ? undefined
                : { opacity: [0.3, 1, 0.3] }
            }
            transition={
              reducedMotion
                ? undefined
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        {/* --- (n) Marquee strip — slides up during Frame 2 --- */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{
            y: reducedMotion ? 0 : marqueeY,
            opacity: reducedMotion ? 1 : marqueeOpacity,
          }}
        >
          <Marquee />
        </motion.div>
      </div>

      {/* --- Sticky mobile CTA --- */}
      <motion.a
        href="#trial"
        style={{ opacity: reducedMotion ? 1 : mobileStickyOpacity }}
        className="fixed inset-x-0 bottom-0 z-50 block bg-accent py-4 text-center font-mono text-sm uppercase tracking-[0.20em] text-canvas md:hidden"
      >
        Start your free trial week →
      </motion.a>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PhotoLayer subcomponent                                           */
/* ------------------------------------------------------------------ */

function PhotoLayer({
  spec,
  y,
  rotate,
  scale,
  reducedMotion,
  hideOnMobile,
}: {
  spec: LayerSpec;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  reducedMotion: boolean;
  hideOnMobile: boolean;
}) {
  const [w, h] = spec.size;
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      data-cursor="photo"
      data-photo-label={`[HERO-${spec.label.replace("_", "")}.JPG]`}
      className={`pointer-events-auto absolute border ${spec.borderClass} bg-white/[0.02] will-change-transform ${spec.position} ${hideOnMobile ? "hidden md:block" : ""}`}
      style={{
        width: w,
        height: h,
        y: reducedMotion ? 0 : y,
        rotate: reducedMotion ? 0 : rotate,
        scale: reducedMotion ? 1 : scale,
      }}
    >
      <span className="absolute -left-10 top-1 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-concrete md:inline">
        {spec.label}
      </span>
      {!failed && (
        <Image
          src={spec.src}
          alt=""
          fill
          sizes={`${w}px`}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </motion.div>
  );
}
