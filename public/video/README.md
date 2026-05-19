# Brand video

Place `brand-loop.mp4` here.

- Source: 1280×720, H.264, ~8 seconds, no audio expected
- The component plays it muted + looped, gated on `useInView`
- Used by: `src/components/sections/Manifesto.tsx`

If renaming an existing file (e.g. `AO_Video_1.mp4` from Instagram), copy to
this directory as `brand-loop.mp4`. Until the file is present, Manifesto
renders a framed `BRAND_LOOP — PENDING` placeholder — composition reads
correctly with no asset.
