import type { CamEvent } from "./sim";
import { sim } from "./sim";

const MAX_BYTES = 2_400_000;
const STEP = 1 / 10;

const EVENTS: CamEvent[] = [
  "none",
  "finger",
  "feet",
  "sky",
  "zoom",
  "whip",
  "trip",
  "flash",
  "focus",
  "shove",
  "commentary",
];

export type TapeKey = number[];

export type PackedTape = {
  keys: TapeKey[];
  len: number;
};

let keys: TapeKey[] = [];
let packed: PackedTape | null = null;
let replayTime = 0;
let lastBlob: Blob | null = null;
let lastMime = "";
let rec: MediaRecorder | null = null;
let chunks: Blob[] = [];
let mime = "";
let glStream: MediaStream | null = null;
let track: MediaStreamTrack | null = null;

function pickMime() {
  const types = [
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4;codecs=avc1.42E01E",
    "video/mp4",
  ];
  if (typeof MediaRecorder === "undefined") return "";
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function r(v: number, n = 3) {
  const m = 10 ** n;
  return Math.round(v * m) / m;
}

function evCode(e: CamEvent) {
  const i = EVENTS.indexOf(e);
  return i < 0 ? 0 : i;
}

function sample(): TapeKey {
  const a = sim.f[0];
  const b = sim.f[1];
  return [
    r(sim.takeTime, 2),
    r(sim.px),
    r(sim.pz),
    r(sim.eye),
    r(sim.yaw, 3),
    r(sim.pitch, 3),
    r(sim.roll, 3),
    r(sim.zoom, 2),
    evCode(sim.event),
    r(a.x),
    r(a.z),
    r(a.yaw, 3),
    a.state === "down" ? 2 : a.state === "punch" || a.state === "windup" ? 1 : 0,
    r(a.punch, 2),
    r(a.downAmt, 2),
    r(b.x),
    r(b.z),
    r(b.yaw, 3),
    b.state === "down" ? 2 : b.state === "punch" || b.state === "windup" ? 1 : 0,
    r(b.punch, 2),
    r(b.downAmt, 2),
  ];
}

export function lastTape() {
  return lastBlob ? { blob: lastBlob, mime: lastMime } : null;
}

export function lastReplay() {
  return packed;
}

export function setReplay(data: PackedTape | null) {
  packed = data;
  replayTime = 0;
}

export function advanceReplay(dt: number) {
  replayTime += dt;
  return replayTime;
}

export function replayNow() {
  return replayTime;
}

export function stampTape(src: HTMLCanvasElement, _hud: { takeTime: number; event: CamEvent; battery: number }) {
  const lastT = keys.length ? keys[keys.length - 1]![0]! : -1;
  if (sim.takeTime - lastT >= STEP) keys.push(sample());
  const gl = src.getContext("webgl2") || src.getContext("webgl");
  gl?.flush();
  const t = track as MediaStreamTrack & { requestFrame?: () => void };
  t?.requestFrame?.();
}

export function beginTape(glCanvas: HTMLCanvasElement) {
  abortTape();
  lastBlob = null;
  lastMime = "";
  packed = null;
  keys = [sample()];
  chunks = [];
  mime = pickMime();
  if (!mime) return;
  try {
    glStream = glCanvas.captureStream(0);
    track = glStream.getVideoTracks()[0] ?? null;
    rec = new MediaRecorder(glStream, {
      mimeType: mime,
      videoBitsPerSecond: 400_000,
    });
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    rec.start();
    const t = track as MediaStreamTrack & { requestFrame?: () => void };
    t?.requestFrame?.();
  } catch {
    rec = null;
    glStream = null;
    track = null;
  }
}

export function abortTape() {
  if (rec && rec.state !== "inactive") {
    try {
      rec.stop();
    } catch {
      /* ignore */
    }
  }
  rec = null;
  chunks = [];
  track = null;
  if (glStream) {
    for (const t of glStream.getTracks()) t.stop();
  }
  glStream = null;
}

export async function finishTape(): Promise<{ blob: Blob; mime: string } | null> {
  packed = { keys: keys.slice(), len: sim.takeTime };
  const recorder = rec;
  rec = null;
  if (recorder && recorder.state === "recording") {
    try {
      recorder.requestData();
    } catch {
      /* ignore */
    }
  }
  const fromRecorder = await new Promise<Blob | null>((resolve) => {
    let settled = false;
    const done = (b: Blob | null) => {
      if (settled) return;
      settled = true;
      resolve(b);
    };
    if (!recorder || recorder.state === "inactive") {
      done(chunks.length ? new Blob(chunks, { type: mime }) : null);
      return;
    }
    recorder.onstop = () => {
      done(chunks.length ? new Blob(chunks, { type: mime || recorder.mimeType }) : null);
    };
    try {
      recorder.stop();
    } catch {
      done(chunks.length ? new Blob(chunks, { type: mime }) : null);
    }
    window.setTimeout(() => {
      done(chunks.length ? new Blob(chunks, { type: mime }) : null);
    }, 1200);
  });

  track = null;
  if (glStream) {
    for (const t of glStream.getTracks()) t.stop();
  }
  glStream = null;

  const blob = fromRecorder;
  const outMime = mime || blob?.type || "video/webm";
  if (!blob || blob.size < 4000) return null;
  if (blob.size > MAX_BYTES) return null;
  chunks = [];
  lastBlob = blob;
  lastMime = outMime;
  return { blob, mime: outMime };
}

export function applyKeyToSim(k: TapeKey) {
  sim.px = k[1]!;
  sim.pz = k[2]!;
  sim.eye = k[3]!;
  sim.yaw = k[4]!;
  sim.pitch = k[5]!;
  sim.roll = k[6]!;
  sim.zoom = k[7]!;
  sim.event = EVENTS[k[8]!] ?? "none";
  const a = sim.f[0];
  const b = sim.f[1];
  a.x = k[9]!;
  a.z = k[10]!;
  a.yaw = k[11]!;
  a.state = k[12] === 2 ? "down" : k[12] === 1 ? "punch" : "idle";
  a.punch = k[13]!;
  a.downAmt = k[14]!;
  b.x = k[15]!;
  b.z = k[16]!;
  b.yaw = k[17]!;
  b.state = k[18] === 2 ? "down" : k[18] === 1 ? "punch" : "idle";
  b.punch = k[19]!;
  b.downAmt = k[20]!;
}

export function keyAt(tape: PackedTape, t: number): TapeKey | null {
  const ks = tape.keys;
  if (!ks.length) return null;
  let lo = 0;
  let hi = ks.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const mt = ks[mid]![0]!;
    if (mt < t) lo = mid + 1;
    else hi = mid;
  }
  const b = ks[lo]!;
  const a = ks[Math.max(0, lo - 1)]!;
  const t0 = a[0]!;
  const t1 = b[0]!;
  const u = t1 - t0 > 1e-3 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 1;
  const out = a.slice() as TapeKey;
  for (let i = 1; i < a.length; i += 1) {
    if (i === 8 || i === 12 || i === 18) {
      out[i] = u < 0.5 ? a[i]! : b[i]!;
    } else {
      out[i] = a[i]! + (b[i]! - a[i]!) * u;
    }
  }
  return out;
}
