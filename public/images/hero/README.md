# Hero Photography

Drop the following three files in this directory. Recommended: high-resolution
landscape JPGs, optimized to <500 KB each.

- **hero-1.jpg** — Group class action shot. Used as the full-bleed background layer.
  Should read at any crop; faces and motion legible. Aim for a wide composition
  that holds up at 16:9 and at vertical mobile crop.

- **hero-2.jpg** — Kettlebell action (or similar high-energy single-athlete moment).
  Used as the mid-depth right-side layer on desktop. Cropping favors a vertical
  or near-square frame at ~38vw width.

- **hero-3.jpg** — Deadlift on the graffiti-backed lifting platform (or the
  signature green training wall). Used as the foreground left-bottom layer on
  desktop. Vertical or square composition, ~30vw width.

If any of these files are missing at build time, that layer hides itself
gracefully and the gradient canvas remains visible — no broken-image icons.
