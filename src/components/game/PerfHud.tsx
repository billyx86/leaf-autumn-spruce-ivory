"use client";

import { useEffect, useState } from "react";
import { classifyFrameMs, frameMeter, isPerfEnabled } from "@/game/perf.mjs";
import { cn } from "@/lib/utils";

const TIER_CLASS: Record<ReturnType<typeof classifyFrameMs>, string> = {
  idle: "text-fg/60",
  ok: "text-green-300",
  warn: "text-amber-300",
  bad: "text-red-400",
};

/**
 * Dev-only FPS + frame-time overlay (gated behind `?perf=1`). Rendered in the
 * game route; invisible and not mounted in normal play.
 *
 * The enable flag is read inside an effect (not during render) so the server
 * and first client paint agree on `null` — no SSR/CSR hydration mismatch from
 * the `typeof window` branch in `perf.mjs`. Colour tracks the frame-time tier
 * (green ≈60 fps, amber ≈30 fps, red below that).
 */
export function PerfHud() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("— fps");
  const [tier, setTier] = useState<ReturnType<typeof classifyFrameMs>>("idle");

  useEffect(() => {
    setOn(isPerfEnabled);
  }, []);

  useEffect(() => {
    if (!on) return;
    const update = () => {
      setLabel(frameMeter.readout());
      setTier(classifyFrameMs(frameMeter.ms));
    };
    update();
    const id = window.setInterval(update, 250);
    return () => window.clearInterval(id);
  }, [on]);

  if (!on) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-2 top-2 z-50 rounded bg-black/60 px-2 py-1 font-mono text-xs",
        TIER_CLASS[tier],
      )}
      data-testid="perf-hud"
    >
      {label}
    </div>
  );
}
