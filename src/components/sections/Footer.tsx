"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
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

  const fadeUp = (delay: number = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ zIndex: 80 }}
    >
      <motion.footer
        id="contact"
        className="relative overflow-hidden bg-canvas"
        initial={reducedMotion || isMobile ? { y: 0 } : { y: "100vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-5% 0px -85% 0px" }}
        transition={{ duration: 2.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="relative px-6 py-16 md:px-12 md:py-20">
          {/* Top-left eyebrow */}
          <div className="mb-12 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            — CONTACT · 008 / FOOTER
          </div>

          {/* Massive display brand */}
          <motion.h2
            {...fadeUp(0.1)}
            className="font-medium text-fg"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.045em",
            }}
          >
            Alpha Omega.
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted"
          >
            BOOT CAMP · HYROX · PERSONAL TRAINING · VICTORVILLE
          </motion.p>

          {/* Main grid */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-12 md:gap-12">
            {/* Map embed */}
            <motion.div {...fadeUp(0.3)} className="md:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-fg/15 bg-canvas-elevated">
                <iframe
                  title="Alpha Omega Fitness location · Victorville, CA"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.5!2d-117.355!3d34.5147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAlpha%20Omega%20Fitness%2C%2012284%20Industrial%20Blvd%2C%20Victorville%2C%20CA%2092395!5e0!3m2!1sen!2sus!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter:
                      "grayscale(0.5) invert(0.92) hue-rotate(180deg) brightness(0.95)",
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                {/* Corner brackets overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute left-2 top-2 h-4 w-4 border-l border-t border-accent" />
                  <div className="absolute right-2 top-2 h-4 w-4 border-r border-t border-accent" />
                  <div className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-accent" />
                  <div className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-accent" />
                </div>
                {/* GPS label */}
                <div className="absolute bottom-3 left-3 bg-canvas/80 px-2 py-1 font-mono text-[10px] tracking-[0.22em] text-fg backdrop-blur-sm">
                  34.5362°N · 117.2906°W
                </div>
              </div>
            </motion.div>

            {/* Contact info column */}
            <motion.div
              {...fadeUp(0.4)}
              className="space-y-8 md:col-span-5"
            >
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  LOCATION
                </div>
                <p className="leading-relaxed text-fg">
                  12284 Industrial Blvd, Suite B-6
                  <br />
                  Victorville, CA 92395
                </p>
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  HOURS
                </div>
                <p className="font-mono text-sm leading-relaxed text-fg">
                  MON–FRI · 4:15 AM – 7:15 PM
                  <br />
                  SAT · 8:00 AM HYROX
                  <br />
                  SUN · CLOSED
                </p>
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  REACH OUT
                </div>
                <div className="space-y-1.5">
                  <a
                    href="tel:+17605964469"
                    className="block text-sm text-fg transition-colors hover:text-accent"
                  >
                    (760) 596-4469 →
                  </a>
                  <a
                    href="https://clients.mindbodyonline.com/classic/ws?studioid=5748844&stype=43&prodid=100006"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-fg transition-colors hover:text-accent"
                  >
                    Book a class →
                  </a>
                  <a
                    href="https://aofithd.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-fg transition-colors hover:text-accent"
                  >
                    aofithd.com →
                  </a>
                  <a
                    href="https://www.instagram.com/aofithd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-fg transition-colors hover:text-accent"
                  >
                    @aofithd · Instagram →
                  </a>
                  <a
                    href="#trial"
                    className="block text-sm text-fg transition-colors hover:text-accent"
                  >
                    Claim 5-day free trial →
                  </a>
                </div>
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  AFFILIATIONS
                </div>
                <div className="inline-flex items-center gap-2 border border-accent/40 bg-canvas-elevated px-3 py-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    OFFICIAL HYROX GYM AFFILIATE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            {...fadeUp(0.55)}
            className="mt-16 flex flex-col gap-4 border-t border-fg/15 pt-6 md:mt-20 md:flex-row md:items-center md:justify-between"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              © 2026 ALPHA OMEGA FITNESS · ALL RIGHTS RESERVED
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              SITE BY{" "}
              <a
                href="#"
                className="text-fg transition-colors hover:text-accent"
              >
                ASHE SYSTEMS
              </a>
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
