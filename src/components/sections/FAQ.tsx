"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Do I need to be fit to start?",
    answer:
      "No. The whole point is that beginners and athletes train the same hour with different weights and modifications. The system is designed for whoever shows up.",
  },
  {
    question: "What should I bring on my first day?",
    answer:
      "Water, athletic shoes, and the willingness to be the slowest person in the room — which you won't be, because we don't run that way.",
  },
  {
    question: "How many people are in a class?",
    answer:
      "Group classes cap at 12–15 members. Personal Training is 1:1 with Coach Vince or Coach Elena. HYROX classes run Saturday mornings with a smaller group focused on race-format work.",
  },
  {
    question: "How is this different from a regular gym?",
    answer:
      "Regular gyms sell you a key card and let you figure it out. We coach a process. Every workout is programmed, every rep can be modified, every member is known by name.",
  },
  {
    question: "What if I'm coming back from an injury?",
    answer:
      "Form is non-negotiable here. We've put 8 years into making sure nobody gets hurt — modifications are built into every workout. Bring your PT's notes if you have them, and Coach Elena will program around your recovery.",
  },
  {
    question: "Can I try before committing?",
    answer:
      "Five days free. No credit card. After that, Part-Time runs $99/month or full Group Training at $109/month with multi-month savings ($299 for 3 months, $589 for 6, $1,149 for the year). Claim it via the trial form below.",
  },
  {
    question: "What's the HYROX class about?",
    answer:
      "We're an Official HYROX Gym Affiliate. Saturday 8 AM, race-format: 8 rounds of 1km runs paired with 8 functional stations (sled push, burpee broad jumps, sandbag lunges, wall balls, etc.). Included with any group membership. Reserve your spot at clients.mindbodyonline.com/classic/ws?studioid=5748844 →",
  },
  {
    question: "Where are you located?",
    answer:
      "12284 Industrial Blvd, Suite B-6, Victorville, CA 92395. Just off Hwy 18 in the High Desert. Parking is free and there's plenty of it.",
  },
];

export default function FAQ() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      style={{ zIndex: 70 }}
    >
      <motion.section
        id="faq"
        className="relative overflow-hidden bg-canvas"
        initial={reducedMotion || isMobile ? { y: 0 } : { y: "100vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-5% 0px -85% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pointer-events-auto flex min-h-screen flex-col px-6 py-16 md:px-12 md:py-24">
          {/* Top-left eyebrow */}
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            — FREQUENTLY ASKED
          </div>

          {/* Top-right section number */}
          <div className="absolute right-6 top-12 flex items-center gap-2.5 md:right-12 md:top-16">
            <div className="h-px w-7 bg-fg-muted" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              007 / FAQ
            </span>
          </div>

          {/* Vertical type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-concrete md:block"
          >
            EIGHT QUESTIONS — STRAIGHT ANSWERS
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
            Questions.
          </motion.h2>

          {/* FAQ list */}
          <motion.div
            {...fadeUp(0.25)}
            className="mx-auto mt-8 w-full max-w-[900px] md:mt-10"
          >
            <ul className="divide-y divide-fg/15 border-y border-fg/15">
              {faqs.map((faq, i) => (
                <FAQRow
                  key={i}
                  faq={faq}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  reducedMotion={reducedMotion}
                />
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

function FAQRow({
  faq,
  index,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
}) {
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <li>
      <button
        onClick={onToggle}
        className="group flex w-full items-center gap-4 py-4 text-left transition-colors hover:text-accent md:gap-6 md:py-5"
        aria-expanded={isOpen}
      >
        <span className="shrink-0 font-mono text-[10px] tracking-[0.22em] text-fg-muted">
          {indexLabel}
        </span>
        <span
          className="flex-1 text-lg text-fg transition-colors group-hover:text-accent md:text-2xl"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {faq.question}
        </span>
        <span
          className={`shrink-0 font-mono text-xl text-fg-muted transition-transform ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        }
        className="overflow-hidden"
      >
        <div className="pb-5 pl-10 pr-8 md:pb-6 md:pl-14">
          <p className="max-w-[60ch] leading-relaxed text-fg-muted">
            {faq.answer}
          </p>
        </div>
      </motion.div>
    </li>
  );
}
