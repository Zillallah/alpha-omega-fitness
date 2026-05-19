"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ITEMS = [
  "8 YEARS",
  "HYROX OFFICIAL",
  "VINCE & ELENA",
  "BOOT CAMP",
  "VICTORVILLE",
  "5.0 ★ GOOGLE",
  "GROUP TRAINING",
  "EST. 2017",
];

export default function Marquee() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Render the list twice so the seamless loop end == start.
  const items = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-fg/10 bg-canvas py-5">
      <motion.div
        className="flex w-max items-center gap-6 whitespace-nowrap will-change-transform"
        animate={
          reducedMotion
            ? undefined
            : { x: ["0%", "-50%"] }
        }
        transition={
          reducedMotion
            ? undefined
            : { duration: 40, ease: "linear", repeat: Infinity }
        }
      >
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 font-mono text-sm uppercase tracking-[0.22em] text-fg md:text-base"
          >
            {item}
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 bg-accent"
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
