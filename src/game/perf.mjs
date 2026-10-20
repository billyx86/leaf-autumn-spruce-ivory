/**
 * Dev-only frame-time meter, gated behind `?perf=1` (see README →
 * "Performance"). It gives a real FPS + frame-time readout so the crowd /
 * spark draw cost (#7) can be verified on-device before any cap is added.
 * Ticked from the game loop (FightScene), rendered by `<PerfHud />`.
 *
 * Kept as plain JS (node-safe, no DOM at module scope) so the math is
 * unit-tested in `scripts/perf.test.mjs`.
 */

/** EMA smoothing factor for the frame-time sample (0 = fully new, 1 = fully old). */
export const ALPHA = 0.1;

/**
 * Fold frame samples into a smoothed frame-time estimate.
 * @returns {{ tick: (dtMs: number) => void, fps: number, ms: number, readout: () => string }}
 */
export function createFrameMeter() {
  let ms = 0;
  return {
    /** Smooth in one frame's duration (ms). Non-positive samples are ignored. */
    tick(dtMs) {
      if (!(dtMs > 0)) return;
      ms = ms === 0 ? dtMs : ms + (dtMs - ms) * ALPHA;
    },
    /** Smoothed frames-per-second (0 before the first sample). */
    get fps() {
      return ms > 0 ? Math.round(1000 / ms) : 0;
    },
    /** Smoothed frame time in milliseconds (0 before the first sample). */
    get ms() {
      return ms;
    },
    /** Human readout, e.g. "61 fps · 16.4 ms". */
    readout() {
      const fps = ms > 0 ? Math.round(1000 / ms) : 0;
      return `${fps} fps · ${ms.toFixed(1)} ms`;
    },
  };
}

/** True when the page was loaded with `?perf=1`. Read once; not reactive. */
export const isPerfEnabled =
  typeof window !== "undefined" && /(^|[?&])perf=1\b/.test(window.location.search);

/** Single meter instance: ticked by the game loop, read by `<PerfHud />`. */
export const frameMeter = createFrameMeter();
