"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ClassType = "GROUP" | "HYROX" | null;

type ClassEntry = {
  time: string;
  mon: ClassType;
  tue: ClassType;
  wed: ClassType;
  thu: ClassType;
  fri: ClassType;
  sat: ClassType;
};

const schedule: ClassEntry[] = [
  { time: "4:15 AM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
  { time: "5:15 AM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
  { time: "6:15 AM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
  { time: "7:15 AM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
  { time: "8:00 AM", mon: null, tue: null, wed: null, thu: null, fri: null, sat: "HYROX" },
  { time: "4:15 PM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
  { time: "5:15 PM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
  { time: "6:15 PM", mon: "GROUP", tue: "GROUP", wed: "GROUP", thu: "GROUP", fri: "GROUP", sat: null },
];

const days = [
  { key: "mon", label: "MON" },
  { key: "tue", label: "TUE" },
  { key: "wed", label: "WED" },
  { key: "thu", label: "THU" },
  { key: "fri", label: "FRI" },
  { key: "sat", label: "SAT" },
] as const;

type DayKey = (typeof days)[number]["key"];

export default function Schedule() {
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
      className="pointer-events-none relative md:-mt-[100vh]"
      style={{ zIndex: 50 }}
    >
      <motion.section
        id="schedule"
        className="relative min-h-[175vh] overflow-hidden bg-canvas"
        initial={reducedMotion || isMobile ? { y: 0 } : { y: "100vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-5% 0px -85% 0px" }}
        transition={{ duration: 2.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="pointer-events-auto sticky top-0 flex h-screen flex-col px-6 py-12 md:px-12 md:py-16">
          {/* Top-left eyebrow */}
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            — SCHEDULE
          </div>

          {/* Top-right section number */}
          <div className="absolute right-6 top-12 flex items-center gap-2.5 md:right-12 md:top-16">
            <div className="h-px w-7 bg-fg-muted" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              005 / SCHEDULE
            </span>
          </div>

          {/* Vertical type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-concrete md:block"
          >
            WHEN WE RUN — VICTORVILLE
          </div>

          {/* Display headline */}
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-8 font-medium text-fg md:mt-12"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            Eight classes daily.{" "}
            <span className="text-accent">Six days a week.</span>
          </motion.h2>

          {/* Schedule grid — desktop */}
          <motion.div
            {...fadeUp(0.25)}
            className="mx-auto mt-8 hidden w-full max-w-[1200px] flex-1 md:block"
          >
            <div className="border border-fg/15">
              {/* Header row */}
              <div className="grid grid-cols-7 border-b border-fg/15">
                <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                  TIME
                </div>
                {days.map((day) => (
                  <div
                    key={day.key}
                    className="border-l border-fg/15 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted"
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              {/* Schedule rows */}
              {schedule.map((row, rowIdx) => (
                <div
                  key={row.time}
                  className={`grid grid-cols-7 ${
                    rowIdx < schedule.length - 1
                      ? "border-b border-fg/10"
                      : ""
                  } ${row.sat === "HYROX" ? "bg-accent/5" : ""}`}
                >
                  <div className="px-4 py-3 font-mono text-xs tracking-[0.18em] text-fg">
                    {row.time}
                  </div>
                  {days.map((day) => {
                    const classType: ClassType = row[day.key as DayKey];
                    return (
                      <div
                        key={day.key}
                        className="flex items-center justify-center border-l border-fg/15 px-4 py-3"
                      >
                        {classType === "HYROX" ? (
                          <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-accent">
                            HYROX
                          </span>
                        ) : classType === "GROUP" ? (
                          <span className="font-mono text-[10px] tracking-[0.22em] text-fg">
                            ●
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-fg-muted/30">
                            —
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
              <div className="flex items-center gap-2">
                <span className="text-fg">●</span>
                <span>GROUP TRAINING · 60 MIN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-accent">HYROX</span>
                <span>RACE-FORMAT · 75 MIN</span>
              </div>
            </div>
          </motion.div>

          {/* Schedule — mobile (vertical day stack) */}
          <motion.div
            {...fadeUp(0.25)}
            className="mt-8 flex-1 space-y-4 overflow-y-auto md:hidden"
          >
            {days.map((day) => {
              const dayClasses = schedule.filter(
                (row) => row[day.key as DayKey] !== null
              );
              return (
                <div key={day.key} className="border border-fg/15 p-4">
                  <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                    {day.label}
                  </div>
                  {dayClasses.length > 0 ? (
                    <ul className="space-y-2">
                      {dayClasses.map((row) => (
                        <li
                          key={row.time}
                          className="flex items-center justify-between"
                        >
                          <span className="font-mono text-sm text-fg">
                            {row.time}
                          </span>
                          <span
                            className={`font-mono text-[10px] tracking-[0.22em] ${
                              row[day.key as DayKey] === "HYROX"
                                ? "font-bold text-accent"
                                : "text-fg-muted"
                            }`}
                          >
                            {row[day.key as DayKey]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-mono text-xs text-fg-muted">CLOSED</p>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Bottom CTA strip */}
          <motion.div
            {...fadeUp(0.5)}
            className="mt-6 flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-accent" />
            <a
              href="#trial"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg transition-colors hover:text-accent"
            >
              CLAIM YOUR 5-DAY FREE TRIAL →
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
