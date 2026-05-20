"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Trial() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      goal: formData.get("goal") as string,
    };

    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }

      setFormState("success");
    } catch (err) {
      setFormState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative md:-mt-[100vh]"
      style={{ zIndex: 60 }}
    >
      <motion.section
        id="trial"
        className="relative min-h-[175vh] overflow-hidden bg-canvas"
        initial={reducedMotion || isMobile ? { y: 0 } : { y: "100vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-15% 0px -40% 0px" }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="sticky top-0 flex h-screen flex-col px-6 py-12 md:px-12 md:py-16">
          {/* Top-left eyebrow */}
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            — FREE TRIAL
          </div>

          {/* Top-right section number */}
          <div className="absolute right-6 top-12 flex items-center gap-2.5 md:right-12 md:top-16">
            <div className="h-px w-7 bg-fg-muted" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              006 / TRIAL
            </span>
          </div>

          {/* Vertical type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-concrete md:block"
          >
            FIVE DAYS — NO COMMITMENT
          </div>

          {/* Display headline */}
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-8 max-w-[18ch] font-medium text-fg md:mt-12"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            Five days. No credit card.{" "}
            <span className="relative inline-block">
              No commitment.
              <motion.span
                aria-hidden="true"
                initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.7,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -left-[2px] -right-[2px] bottom-[6px] z-[-1] h-[8px] origin-left bg-accent"
              />
            </span>
          </motion.h2>

          {/* Main grid */}
          <div className="mx-auto mt-6 grid w-full max-w-[1400px] flex-1 grid-cols-1 items-start gap-6 md:mt-8 md:grid-cols-12 md:gap-12">
            {/* Form column */}
            <motion.div
              {...fadeUp(0.2)}
              className="border border-fg/15 bg-canvas-elevated p-6 md:col-span-7 md:p-8"
            >
              {formState !== "success" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted"
                    >
                      NAME
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      disabled={formState === "submitting"}
                      className="w-full border border-fg/20 bg-canvas px-4 py-3 font-mono text-sm text-fg transition-colors focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted"
                    >
                      EMAIL
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={formState === "submitting"}
                      className="w-full border border-fg/20 bg-canvas px-4 py-3 font-mono text-sm text-fg transition-colors focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted"
                    >
                      PHONE
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      disabled={formState === "submitting"}
                      className="w-full border border-fg/20 bg-canvas px-4 py-3 font-mono text-sm text-fg transition-colors focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="goal"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted"
                    >
                      WHAT&apos;S YOUR GOAL?{" "}
                      <span className="text-fg-muted/60">(OPTIONAL)</span>
                    </label>
                    <textarea
                      id="goal"
                      name="goal"
                      rows={3}
                      disabled={formState === "submitting"}
                      placeholder="Get stronger. Lose weight. Train for HYROX. Whatever it is — Vince wants to know."
                      className="w-full resize-none border border-fg/20 bg-canvas px-4 py-3 font-mono text-sm text-fg transition-colors placeholder:text-fg-muted/40 focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  {formState === "error" && (
                    <p className="font-mono text-xs text-red-400">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-fg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {formState === "submitting"
                      ? "SENDING..."
                      : "CLAIM YOUR 5-DAY TRIAL →"}
                  </button>

                  <p className="pt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-fg-muted/70">
                    No credit card required. Vince personally responds within
                    24 hours.
                  </p>
                </form>
              ) : (
                <div className="py-6">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    — SUBMISSION RECEIVED
                  </div>
                  <h3
                    className="mb-4 leading-tight text-fg"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                    }}
                  >
                    Check your email.
                  </h3>
                  <p className="mb-6 leading-relaxed text-fg-muted">
                    We just sent you trial details. Vince will personally reach
                    out within 24 hours to lock in your first session.
                  </p>
                  <div className="border-t border-fg/15 pt-6">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                      OR SKIP THE WAIT
                    </p>
                    <a
                      href="https://aofithd.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-fg transition-colors hover:text-accent"
                    >
                      JOIN PART-TIME MEMBERSHIP · $99/MO →
                    </a>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Proof column */}
            <motion.div
              {...fadeUp(0.35)}
              className="space-y-6 md:col-span-5 md:space-y-8"
            >
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Stat label="YEARS RUNNING" value="8" />
                <Stat label="GOOGLE RATING" value="5.0" suffix="/23" />
                <Stat label="INJURIES" value="0" />
              </div>

              {/* Quote */}
              <div className="border-l-2 border-accent pl-5">
                <p
                  className="max-w-[24ch] text-xl leading-tight text-fg md:text-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                  }}
                >
                  Tell me what brought you in. Then we build from there.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  — VINCE GREENE · COACH
                </p>
              </div>

              {/* Affiliate badge */}
              <div className="flex items-center gap-3 border border-accent/40 bg-canvas-elevated px-4 py-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  OFFICIAL HYROX GYM AFFILIATE
                </span>
              </div>

              {/* Address */}
              <div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  LOCATION · VICTORVILLE
                </div>
                <p className="font-mono text-xs leading-relaxed text-fg">
                  34.5362°N · 117.2906°W
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[9px] uppercase leading-tight tracking-[0.18em] text-fg-muted">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="leading-none text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
          }}
        >
          {value}
        </span>
        {suffix && (
          <span className="font-mono text-[10px] tracking-[0.18em] text-fg-muted">
            {suffix}
          </span>
        )}
      </div>
      <div aria-hidden="true" className="mt-2 h-px w-8 bg-accent" />
    </div>
  );
}
