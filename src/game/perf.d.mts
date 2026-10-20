/** Type surface for the plain-JS meter in `perf.mjs` (unit-tested via node). */

export interface FrameMeter {
  /** Smooth in one frame's duration (ms). Non-positive samples are ignored. */
  tick: (dtMs: number) => void;
  /** Smoothed frames-per-second (0 before the first sample). */
  readonly fps: number;
  /** Smoothed frame time in milliseconds (0 before the first sample). */
  readonly ms: number;
  /** Human readout, e.g. "61 fps · 16.4 ms". */
  readout: () => string;
}

/** EMA smoothing factor for the frame-time sample (0 = fully new, 1 = fully old). */
export const ALPHA: number;

/** Fold frame samples into a smoothed frame-time estimate. */
export function createFrameMeter(): FrameMeter;

/** True when the page was loaded with `?perf=1`. Read once; not reactive. */
export const isPerfEnabled: boolean;

/** Single meter instance: ticked by the game loop, read by `<PerfHud />`. */
export const frameMeter: FrameMeter;
