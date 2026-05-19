"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "default" | "photo" | "button";

/**
 * Custom desktop cursor — yellow crosshair, live coordinates, lerp follow.
 * - Default: 24x24 crosshair + live X/Y coords
 * - Hover [data-cursor="photo"]: expands to 48x48, displays data-photo-label
 * - Hover a / button / [role="button"]: arrow shape + "→ CLICK"
 * - Hidden on touch, reduced-motion, and before first mousemove
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [photoLabel, setPhotoLabel] = useState("");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let firstMove = false;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!firstMove) {
        firstMove = true;
        current.current = { x: e.clientX, y: e.clientY };
        setVisible(true);
      }

      const t = e.target as HTMLElement | null;
      if (!t) return;
      const photoEl = t.closest('[data-cursor="photo"]') as HTMLElement | null;
      const clickEl = t.closest(
        'a, button, [role="button"]'
      ) as HTMLElement | null;

      if (photoEl) {
        setVariant("photo");
        setPhotoLabel(photoEl.dataset.photoLabel ?? "[PHOTO]");
      } else if (clickEl) {
        setVariant("button");
      } else {
        setVariant("default");
      }
    };

    window.addEventListener("mousemove", handleMove);

    let lastCoordTick = 0;
    const animate = (time: number) => {
      const lerp = 0.18;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      const x = current.current.x;
      const y = current.current.y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${x + 18}px, ${y + 18}px, 0)`;
      }

      // ~30fps coordinate text updates (cheap)
      if (time - lastCoordTick > 33) {
        setCoords({ x: Math.round(x), y: Math.round(y) });
        lastCoordTick = time;
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const opacity = visible ? 1 : 0;
  const isPhoto = variant === "photo";
  const isButton = variant === "button";
  const labelText = isPhoto
    ? photoLabel
    : isButton
      ? "→ CLICK"
      : `X: ${coords.x} · Y: ${coords.y}`;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ opacity, transition: "opacity 180ms ease" }}
      >
        {isButton ? (
          // Arrow shape
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            style={{
              transition: "transform 180ms ease",
              transform: "translate(-50%, -50%)",
            }}
          >
            <path
              d="M3 3 L19 11 L11 13 L9 21 Z"
              fill="#FCDB1A"
              stroke="#FCDB1A"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Crosshair — two perpendicular lines, sized by variant
          <div
            className="relative"
            style={{
              width: isPhoto ? 48 : 24,
              height: isPhoto ? 48 : 24,
              transform: "translate(-50%, -50%)",
              transition: "width 200ms ease, height 200ms ease",
            }}
          >
            <span
              className="absolute left-1/2 top-0 bottom-0"
              style={{
                width: 1,
                background: "#FCDB1A",
                transform: "translateX(-50%)",
              }}
            />
            <span
              className="absolute top-1/2 left-0 right-0"
              style={{
                height: 1,
                background: "#FCDB1A",
                transform: "translateY(-50%)",
              }}
            />
          </div>
        )}
      </div>

      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] whitespace-nowrap"
        style={{
          opacity,
          transition: "opacity 180ms ease",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: "#FCDB1A",
          textTransform: "uppercase",
        }}
      >
        {labelText}
      </div>
    </>
  );
}
