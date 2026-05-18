"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HEADLINE_LINES = [
  "Group training",
  "that gets results.",
  "8 years of proof.",
];

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero — Batch 1 of 5.
 * Editorial-industrial composition: three-layer parallax photography,
 * italic display H1 with mask-up reveal, HYROX yellow CTA on pure obsidian.
 *
 * Image assets are dropped between batches into /public/images/hero/.
 * If a layer's image is missing, that layer hides itself and the gradient
 * canvas + adjacent layers remain visible — no broken-image artifacts.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Three-layer parallax depth
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const layer1Scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -360]);

  // Mobile sticky CTA fades in after 30% scroll through hero
  const stickyOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] md:min-h-[110vh] w-full overflow-hidden bg-canvas bg-gradient-to-br from-zinc-950 via-zinc-900 to-black"
    >
      {/* Layer 1 — full-bleed background */}
      <ParallaxImage
        src="/images/hero/hero-1.jpg"
        y={layer1Y}
        scale={layer1Scale}
        wrapperClassName="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />

      {/* Layer 2 — mid depth, right side, desktop only */}
      <ParallaxImage
        src="/images/hero/hero-2.jpg"
        y={layer2Y}
        wrapperClassName="absolute right-[5%] top-[20%] hidden md:block w-[38vw] max-w-[480px]"
        imgClassName="w-full h-auto object-cover"
      />

      {/* Layer 3 — foreground, left bottom, desktop only */}
      <ParallaxImage
        src="/images/hero/hero-3.jpg"
        y={layer3Y}
        wrapperClassName="absolute left-[-2%] bottom-[8%] hidden md:block w-[30vw] max-w-[380px]"
        imgClassName="w-full h-auto object-cover"
      />

      {/* Gradient overlay — above photos, below content */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] md:min-h-[110vh] flex-col px-6 pt-10 pb-28 md:px-12 md:pt-12 md:pb-16 lg:px-16">
        {/* Tactical eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="tactical text-fg-muted"
        >
          ALPHA OMEGA · VICTORVILLE · EST. 2017
        </motion.div>

        {/* Italic editorial H1 — the signature */}
        <h1
          className="display-italic text-fg mt-auto"
          style={{ fontSize: "clamp(3.5rem, 11vw, 12rem)" }}
        >
          {HEADLINE_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.3 + i * 0.12,
                  ease: REVEAL_EASE,
                }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Sub-deck */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-[36ch] text-lg text-fg-muted md:text-xl"
        >
          Boot camp coaching with Vince and Elena in Victorville.
          <br />
          Beginners through athletes. Modifications for every body.
        </motion.p>

        {/* Primary CTA — HYROX yellow, sharp edges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-10"
        >
          <a
            href="#trial"
            className="tactical inline-block bg-accent px-8 py-4 text-sm text-canvas transition-all duration-200 hover:scale-[1.02] hover:bg-accent-warm"
          >
            Start your free trial week →
          </a>
        </motion.div>

        {/* HYROX badge — desktop only */}
        <div className="tactical text-fg-muted absolute bottom-8 right-12 hidden items-center gap-2 md:flex lg:right-16">
          <span className="inline-block h-2 w-2 bg-accent" aria-hidden />
          OFFICIAL HYROX GYM AFFILIATE
        </div>

        {/* Scroll cue — desktop only */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-fg-muted md:flex">
          <span className="tactical">SCROLL</span>
          <div className="relative h-12 w-px overflow-hidden">
            <motion.span
              animate={{ y: ["-100%", "100%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-x-0 top-0 block h-full w-px bg-fg-muted"
            />
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA — fades in after 30% scroll */}
      <motion.a
        href="#trial"
        style={{ opacity: stickyOpacity }}
        className="tactical fixed inset-x-0 bottom-0 z-50 block bg-accent py-4 text-center text-sm text-canvas md:hidden"
      >
        Start your free trial week →
      </motion.a>
    </section>
  );
}

/**
 * Parallax image layer with graceful fallback.
 * On error, the image is hidden and the parent gradient/overlay shows through.
 */
function ParallaxImage({
  src,
  y,
  scale,
  wrapperClassName,
  imgClassName,
}: {
  src: string;
  // framer-motion MotionValue<number>; typed loosely to avoid an import-only type
  y: ReturnType<typeof useTransform<number, number>>;
  scale?: ReturnType<typeof useTransform<number, number>>;
  wrapperClassName: string;
  imgClassName: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <motion.div
      style={scale ? { y, scale } : { y }}
      className={`${wrapperClassName} will-change-transform`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        onError={() => setFailed(true)}
        className={imgClassName}
      />
    </motion.div>
  );
}
