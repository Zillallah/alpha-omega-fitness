# Alpha Omega Fitness — Project Agent Rules

> This file is loaded into every Claude Code / Codex session opened in this repository.
> CLAUDE.md re-exports it via `@AGENTS.md`. Read it fully before generating any code.

---

## Project

Single-page conversion website for **Alpha Omega Fitness**, a boot camp gym in Victorville, CA. Built by **Ashe Systems Consulting** (operator: SGreene) as a spec build for client pitch. Sibling project: `athlos-training-grounds` (already deployed, different design language — do NOT replicate it here).

---

## Aesthetic mandate — DO NOT DEVIATE

The design system is **GROUND TRUTH** — editorial-industrial.

- Reference points: Locomotive Mtl, Active Theory, Awwwards-tier sites, Tracksmith editorial sports magazines, HYROX race brand aesthetic.
- **Not** Apple product pages.
- **Not** premium boutique studio (Athlos occupies that lane).
- **Italic editorial display is the signature.** H1 uses Instrument Serif italic at `clamp(3.5rem, 11vw, 12rem)`. Never downgrade to a regular serif.
- **HYROX yellow (`#FCDB1A`) is the owned brand accent.** Reserved for primary CTAs, accent strikes, HYROX badge moments. Never for body text or large surfaces.
- Canvas: pure obsidian (`#0A0A0A`). Text: warm off-white (`#F5F5F0`). Industrial gray (`#3D3D3D`) for dividers/concrete surfaces.
- **No element tricks.** No 3D tilt, no SVG distortion, no neon glow, no hover-glitch, no element-level gimmicks.
- **All motion is composition.** Parallax depth, sticky narrative, italic mask reveals, scroll-bound number counters. Composition moves only.

---

## Tech stack — locked

- **Next.js 16** (App Router only — no Pages Router). Some APIs differ from Next 15 training data; consult `node_modules/next/dist/docs/` for breaking changes before using cached patterns.
- **TypeScript** strict mode.
- **Tailwind CSS v4** — use `@theme` directive in `src/app/globals.css`. Do NOT use `tailwind.config.js` color extensions.
- **Framer Motion** (latest).
- **Lenis** smooth scroll (latest) — wired via `src/components/providers/LenisProvider.tsx`, required for all scroll-driven motion.
- **Supabase** — client created in `src/lib/supabase.ts` for form storage in Batch 4.
- **Resend** — server-side email in Batch 4.
- **Vercel** deployment.

No additional motion libraries. No GSAP. No Three.js. No Anime.js. Framer Motion + Lenis cover everything we need.

---

## Build discipline — BATCHED, NOT FREELANCED

This site is built in **batches**. Never build sections outside the current batch's scope. If a batch prompt doesn't mention a section, do not touch it — even if you think it would help.

| Batch | Scope | Status |
|---|---|---|
| 1 | Foundation + Hero | ✅ Complete |
| 2 | Trust marquee + Manifesto + Meet Vince & Elena | Pending |
| 3 | Programs + HYROX section + Schedule | Pending |
| 4 | Member stories + Free Trial CTA (Supabase + Resend) + Pricing | Pending |
| 5 | FAQ + Location/Footer + final QA + deploy | Pending |

Per-batch build log lives at `docs/build_log.md` (added between Batch 1 and Batch 2).

---

## Component conventions

- **Client components** must be marked `"use client"`. Required for any use of Framer Motion, Lenis, or React hooks.
- **Server components** are the default. Use them whenever interactivity isn't required.
- Sections live in `src/components/sections/[SectionName].tsx` — one section per file, no exceptions.
- Section files anchor with `id="section-name"` for in-page scroll navigation.
- Shared utilities live in `src/lib/`. Providers in `src/components/providers/`.

---

## Asset conventions

- All photography lives in `/public/images/[section]/`.
- Filenames: `[section]-N.jpg` — `hero-1.jpg`, `coaches-1.jpg`, `programs-1.jpg`, etc.
- Source: Alpha Omega's Instagram @aofithd. Operator scrapes and drops; do not invent or AI-generate.
- **Never use stock photography.**
- **Never use AI-generated images.**
- Action shots are preferred over posed shots.
- Fallback for missing photos: gradient `bg-gradient-to-br from-zinc-950 via-zinc-900 to-black`. Never use placeholder boxes.

---

## Business details — canonical

| Field | Value |
|---|---|
| Business name | Alpha Omega Fitness |
| Address | 12284 Industrial Blvd, Ste B-6, Victorville, CA 92395 |
| Phone | (760) 694-3459 |
| Instagram | @aofithd → https://instagram.com/aofithd |
| Booking | https://clients.mindbodyonline.com/classic/ws?studioid=5748844 |
| Reviews | 5.0★ on Google · 23 reviews |
| Established | 2017 (8 years in operation) |
| Designation | **Official HYROX Gym Affiliate** — credentialed; surface prominently |
| Coaches | Vince (owner) and Elena |

Hardcode these values exactly. If something in a batch prompt contradicts this table, flag it to the operator before proceeding.

---

## Performance budget

- Mobile LCP < 2.0s (verified against deployed Vercel preview, not local dev).
- Mobile-first responsive — must work cleanly from 375px to 2560px without layout breaks.
- All images via `next/image` with explicit `sizes` props.
- All fonts via `next/font` (no `@import url()` from Google Fonts in CSS).
- No unused dependencies.

---

## Things to NEVER do

1. Do NOT build sections outside the current batch.
2. Do NOT use stock photos or AI-generated imagery.
3. Do NOT introduce additional motion libraries.
4. Do NOT add 3D tilt, SVG distortion, neon glow, or element-trick effects.
5. Do NOT use rounded corners on primary CTAs (industrial = sharp edges).
6. Do NOT use orange as an accent — HYROX yellow only.
7. Do NOT downgrade the italic display headline to a regular serif.
8. Do NOT silently "improve" specs without flagging to the operator.
9. Do NOT commit `.env.local` or any file with real API keys.

---

## When in doubt

Stop and ask the operator before proceeding. Never guess at design choices that conflict with the mandate above. Surface ambiguity rather than resolving it silently.

---

## Build context

- **Operator:** SGreene (Ashe Systems Consulting)
- **Client:** Alpha Omega Fitness — Vince and Elena
- **Pitch model:** Spec build → present completed work → tiered pricing ($5K floor for site, separate line items for upsells)
- **Upsell pipeline (post-close, not in this build):** Booking agent integration, trial-to-member SMS sequence, retention sequence, referral automation, AI chat widget, member portal.

Future batches may reference upsell hooks but must not implement them in this build.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
