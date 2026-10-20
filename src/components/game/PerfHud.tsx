"use client";

import { useEffect, useState } from "react";
import { frameMeter, isPerfEnabled } from "@/game/perf.mjs";

/**
 * Dev-only FPS + frame-time overlay (gated behind `?perf=1`). Rendered in the
 * game route; invisible and not mounted in normal play.
 *
 * The enable flag is read inside an effect (not during render) so the server
 * and first client paint agree on `null` — no SSR/CSR hydration mismatch from
 * the `typeof window` branch in `perf.mjs`.
 */
export function PerfHud() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("— fps");

  useEffect(() => {
    setOn(isPerfEnabled);
  }, []);

  useEffect(() => {
    if (!on) return;
    setLabel(frameMeter.readout());
    const id = window.setInterval(() => setLabel(frameMeter.readout()), 250);
    return () => window.clearInterval(id);
  }, [on]);

  if (!on) return null;

  return (
    <div
      className="pointer-events-none absolute left-2 top-2 z-50 rounded bg-black/60 px-2 py-1 font-mono text-xs text-green-300"
      data-testid="perf-hud"
    >
      {label}
    </div>
  );
}
