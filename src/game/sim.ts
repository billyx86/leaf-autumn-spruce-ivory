import { BOXES, FIGHT, SPAWN, TAKE_LEN } from "./layout";
import { input } from "./input";

export type CamEvent =
  | "none"
  | "finger"
  | "feet"
  | "sky"
  | "zoom"
  | "whip"
  | "trip"
  | "flash"
  | "focus"
  | "shove"
  | "commentary";

export type PunchKind = "jab" | "cross" | "haymaker" | "none";

export type Fighter = {
  x: number;
  z: number;
  yaw: number;
  hp: number;
  downs: number;
  state: "idle" | "windup" | "punch" | "recover" | "hit" | "down" | "getup";
  t: number;
  punch: number;
  walk: number;
  downAmt: number;
  kind: PunchKind;
  power: number;
};

export type TakeResults = {
  score: number;
  clips: number;
  grade: string;
  roast: string;
  viral: number;
  subjectPct: number;
  feet: number;
  sky: number;
  hitsTaken: number;
  fingers: number;
  punchesSeen: number;
};

export type Impact = {
  x: number;
  z: number;
  heavy: boolean;
  down: boolean;
  seen: boolean;
};

type ScriptBeat = { who: 0 | 1; kind: PunchKind; at: number };

const SHOUTS = [
  "OI OI OI",
  "LEAVE IT",
  "WHOA WHOA",
  "GET HIM",
  "PHONE UP",
  "HAVE IT",
  "NO NO NO",
  "HE'S DOWN",
];

const EVENTS: { kind: CamEvent; w: number }[] = [
  { kind: "whip", w: 2.2 },
  { kind: "feet", w: 1.8 },
  { kind: "sky", w: 1.1 },
  { kind: "zoom", w: 2.0 },
  { kind: "finger", w: 1.8 },
  { kind: "focus", w: 1.2 },
  { kind: "trip", w: 0.7 },
  { kind: "flash", w: 0.45 },
];

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function angWrap(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

function hypot2(x: number, z: number) {
  return Math.hypot(x, z);
}

function collide(x: number, z: number, r: number) {
  x = clamp(x, -14.6, 14.6);
  z = clamp(z, -13.8, 14.4);
  for (const b of BOXES) {
    if (x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1) {
      const left = x - b.x0;
      const right = b.x1 - x;
      const top = z - b.z0;
      const bot = b.z1 - z;
      const m = Math.min(left, right, top, bot);
      if (m === left) x = b.x0 - r;
      else if (m === right) x = b.x1 + r;
      else if (m === top) z = b.z0 - r;
      else z = b.z1 + r;
      continue;
    }
    const qx = clamp(x, b.x0, b.x1);
    const qz = clamp(z, b.z0, b.z1);
    const dx = x - qx;
    const dz = z - qz;
    const d2 = dx * dx + dz * dz;
    if (d2 > 0 && d2 < r * r) {
      const d = Math.sqrt(d2);
      const push = (r - d) / d;
      x += dx * push;
      z += dz * push;
    }
  }
  return { x, z };
}

function makeFighter(side: 1 | -1): Fighter {
  return {
    x: side * 1.15,
    z: 0.2 * side,
    yaw: side > 0 ? -Math.PI / 2 : Math.PI / 2,
    hp: 100,
    downs: 0,
    state: "idle",
    t: 0,
    punch: 0,
    walk: 0,
    downAmt: 0,
    kind: "none",
    power: 0,
  };
}

function buildScript(): ScriptBeat[] {
  const beats: ScriptBeat[] = [];
  let t = 1.35;
  let who: 0 | 1 = 0;
  while (t < TAKE_LEN + 8) {
    const roll = Math.random();
    const kind: PunchKind =
      roll < 0.12 ? "haymaker" : roll < 0.42 ? "jab" : "cross";
    beats.push({ who, kind, at: t });
    t += kind === "haymaker" ? 1.55 + Math.random() * 0.4 : 0.62 + Math.random() * 0.55;
    if (Math.random() < 0.72) who = (1 - who) as 0 | 1;
  }
  return beats;
}

export function makeSim() {
  return {
    animTime: 0,
    takeTime: 0,
    px: SPAWN.x,
    pz: SPAWN.z,
    yaw: Math.atan2(SPAWN.x, SPAWN.z),
    pitch: -0.08,
    roll: 0,
    vx: 0,
    vz: 0,
    speed: 0,
    zoom: 1,
    zoomT: 1,
    zoomV: 0,
    panic: 0.22,
    sprint: false,
    event: "none" as CamEvent,
    eventT: 0,
    eventDur: 0,
    eventCd: 2.6,
    eye: 1.58,
    eyeT: 1.58,
    score: 0,
    viral: 12,
    clips: 0,
    battery: 17,
    inFrame: 0 as 0 | 1 | 2,
    note: "Keep them in frame. You won't.",
    flash: "",
    flashT: 0,
    caption: "",
    captionT: 0,
    sirens: false,
    fightOver: false,
    aftermath: 0,
    wantEnd: false,
    ended: false,
    pendingHit: null as Impact | null,
    crowdRecoil: 0,
    walkPhase: 0,
    impYaw: 0,
    impPitch: 0,
    f: [makeFighter(1), makeFighter(-1)] as [Fighter, Fighter],
    script: buildScript(),
    scriptI: 0,
    stats: {
      subject: 0,
      feet: 0,
      sky: 0,
      wall: 0,
      hitsTaken: 0,
      fingers: 0,
      punchesSeen: 0,
    },
    grade: "F",
    roast: "",
  };
}

export type Sim = ReturnType<typeof makeSim>;

export const sim: Sim = makeSim();

export function resetSim() {
  Object.assign(sim, makeSim());
}

function pickEvent(s: Sim): CamEvent {
  const moving = s.speed > 1.4;
  let total = 0;
  const bag: { kind: CamEvent; w: number }[] = [];
  for (const e of EVENTS) {
    if (e.kind === "trip" && !moving) continue;
    bag.push(e);
    total += e.w;
  }
  let r = Math.random() * total;
  for (const e of bag) {
    r -= e.w;
    if (r <= 0) return e.kind;
  }
  return "whip";
}

function startEvent(s: Sim, kind: CamEvent) {
  s.event = kind;
  s.eventT = 0;
  s.eventDur =
    kind === "flash"
      ? 0.18
      : kind === "whip"
        ? 0.7
        : kind === "trip"
          ? 1.15
          : 1.05 + Math.random() * 0.7;
  s.panic = clamp(s.panic + 0.18, 0, 1);
  if (kind === "whip") s.impYaw = (Math.random() < 0.5 ? 1 : -1) * (0.85 + Math.random() * 0.45);
  if (kind === "feet") s.impPitch = -0.7;
  if (kind === "sky") s.impPitch = 0.62;
  if (kind === "trip") {
    s.eyeT = 0.28;
    s.impPitch = -0.55;
    s.impYaw += (Math.random() - 0.5) * 0.4;
  }
  if (kind === "zoom") s.zoomT = Math.random() < 0.5 ? 3.4 : 1.05;
  if (kind === "finger") s.stats.fingers += 1;
  if (kind === "flash") s.flashT = 0.16;
  if (kind === "commentary") {
    s.caption = SHOUTS[(Math.random() * SHOUTS.length) | 0] ?? "OI";
    s.captionT = 1.15;
    s.impYaw += (Math.random() - 0.5) * 0.25;
    s.panic = clamp(s.panic + 0.22, 0, 1);
  }
  if (kind === "shove") {
    s.stats.hitsTaken += 1;
    s.impYaw += (Math.random() < 0.5 ? 1 : -1) * 0.7;
    s.impPitch -= 0.25;
    const dx = s.px - FIGHT.x;
    const dz = s.pz - FIGHT.z;
    const d = Math.max(0.4, hypot2(dx, dz));
    s.vx += (dx / d) * 6.5;
    s.vz += (dz / d) * 6.5;
    s.flash = "YOU GOT CLIPPED";
    s.flashT = 0.7;
  }
}

function windupTime(kind: PunchKind) {
  if (kind === "haymaker") return 0.52;
  if (kind === "cross") return 0.26;
  return 0.16;
}

function punchPower(kind: PunchKind) {
  if (kind === "haymaker") return 22;
  if (kind === "cross") return 13;
  return 8;
}

function updateFighters(s: Sim, dt: number, live: boolean) {
  const t = s.animTime;
  for (let i = 0; i < 2; i += 1) {
    const f = s.f[i]!;
    const o = s.f[1 - i]!;
    f.t += dt;
    f.walk += dt * (f.state === "down" ? 0 : 5.4);

    if (f.state === "down") {
      f.downAmt = clamp(f.downAmt + dt * 2.4, 0, 1);
      f.punch = 0;
      if (live && f.downs < 2 && f.t > 2.1) {
        f.state = "getup";
        f.t = 0;
        f.hp = 42;
      }
      continue;
    }
    if (f.state === "getup") {
      f.downAmt = clamp(f.downAmt - dt * 1.6, 0, 1);
      if (f.downAmt <= 0.02) {
        f.downAmt = 0;
        f.state = "idle";
        f.t = 0;
      }
      continue;
    }

    const ang = t * 0.55 + i * Math.PI;
    const r = 1.08 + 0.1 * Math.sin(t * 1.7 + i);
    const tx = Math.cos(ang) * r;
    const tz = Math.sin(ang) * r;
    if (f.state === "idle" || f.state === "recover") {
      f.x += (tx - f.x) * (1 - Math.exp(-dt * 3.2));
      f.z += (tz - f.z) * (1 - Math.exp(-dt * 3.2));
    }
    f.yaw = Math.atan2(o.x - f.x, o.z - f.z);

    if (f.state === "hit") {
      f.punch = clamp(f.punch - dt * 3, 0, 1);
      const dx = f.x - o.x;
      const dz = f.z - o.z;
      const d = Math.max(0.4, hypot2(dx, dz));
      f.x += (dx / d) * 1.1 * dt;
      f.z += (dz / d) * 1.1 * dt;
      if (f.t > 0.28) {
        f.state = "idle";
        f.t = 0;
      }
      continue;
    }

    if (f.state === "windup") {
      f.punch = clamp(f.t / Math.max(0.12, windupTime(f.kind) * 0.7), 0, 0.45);
      if (f.t >= windupTime(f.kind)) {
        f.state = "punch";
        f.t = 0;
      }
      continue;
    }

    if (f.state === "punch") {
      f.punch = 0.45 + Math.min(1, f.t / 0.08) * 0.55;
      const reach = hypot2(o.x - f.x, o.z - f.z);
      if (f.t < 0.11 && reach < 1.62 && o.state !== "down" && o.state !== "getup") {
        o.state = "hit";
        o.t = 0;
        o.hp -= f.power;
        const heavy = f.kind === "haymaker";
        let down = false;
        if (o.hp <= 0) {
          o.state = "down";
          o.t = 0;
          o.downs += 1;
          o.hp = 0;
          down = true;
          if (o.downs >= 2) s.fightOver = true;
        }
        s.pendingHit = { x: (f.x + o.x) * 0.5, z: (f.z + o.z) * 0.5, heavy, down, seen: false };
        s.crowdRecoil = 1;
        const dx = o.x - f.x;
        const dz = o.z - f.z;
        const d = Math.max(0.3, hypot2(dx, dz));
        o.x += (dx / d) * (heavy ? 0.55 : 0.28);
        o.z += (dz / d) * (heavy ? 0.55 : 0.28);
      }
      if (f.t > 0.14) {
        f.state = "recover";
        f.t = 0;
      }
      continue;
    }

    if (f.state === "recover") {
      f.punch = clamp(f.punch - dt * 2.6, 0, 1);
      if (f.t > 0.32) {
        f.state = "idle";
        f.t = 0;
        f.kind = "none";
      }
    }
  }

  if (!live || s.fightOver) return;

  while (s.scriptI < s.script.length && s.script[s.scriptI]!.at <= s.takeTime) {
    const beat = s.script[s.scriptI]!;
    s.scriptI += 1;
    const f = s.f[beat.who]!;
    if (f.state !== "idle" && f.state !== "recover") continue;
    if (s.f[1 - beat.who]!.state === "down") continue;
    f.state = "windup";
    f.t = 0;
    f.kind = beat.kind;
    f.power = punchPower(beat.kind);
  }
}

export type FrameInput = {
  moveF: number;
  moveR: number;
  lookX: number;
  lookY: number;
  zoomDelta: number;
  sprint: boolean;
  panic: boolean;
  playing: boolean;
};

export function tickSim(dt: number, inp: FrameInput) {
  const s = sim;
  s.animTime += dt;
  s.crowdRecoil = Math.max(0, s.crowdRecoil - dt * 1.8);
  s.impYaw *= Math.exp(-dt * 5.5);
  s.impPitch *= Math.exp(-dt * 4.8);
  s.flashT = Math.max(0, s.flashT - dt);
  s.captionT = Math.max(0, s.captionT - dt);
  if (s.flashT <= 0) s.flash = "";
  if (s.captionT <= 0) s.caption = "";

  updateFighters(s, dt, true);

  if (!inp.playing) {
    s.event = "none";
    return;
  }

  s.takeTime += dt;
  s.battery = clamp(17 - (s.takeTime / TAKE_LEN) * 13, 3.5, 18);
  if (s.takeTime > TAKE_LEN - 9) s.sirens = true;
  if (s.fightOver) s.aftermath += dt;

  s.yaw -= inp.lookX * 0.00215;
  s.pitch -= inp.lookY * 0.002;
  s.yaw += s.impYaw * dt * 3.2;
  s.pitch += s.impPitch * dt * 3.2;
  s.pitch = clamp(s.pitch, -1.32, 1.22);

  if (s.event === "feet") s.pitch = clamp(s.pitch - dt * 1.8, -1.32, 1.22);
  if (s.event === "sky") s.pitch = clamp(s.pitch + dt * 1.6, -1.32, 1.22);

  s.zoomT = clamp(s.zoomT + inp.zoomDelta, 1, 3.8);
  if (s.event === "zoom") {
    s.zoomT += Math.sin(s.eventT * 9.5) * dt * 4.5;
    s.zoomT = clamp(s.zoomT, 1, 3.8);
  }
  s.zoomV += (s.zoomT - s.zoom) * 14 * dt;
  s.zoomV *= Math.exp(-dt * 7.5);
  s.zoom = clamp(s.zoom + s.zoomV * dt, 1, 3.9);
  s.zoomT += (1.15 - s.zoomT) * dt * 0.07;

  const fx = -Math.sin(s.yaw);
  const fz = -Math.cos(s.yaw);
  const rx = Math.cos(s.yaw);
  const rz = -Math.sin(s.yaw);
  let mf = inp.moveF;
  let mr = inp.moveR;
  const mag = Math.hypot(mf, mr);
  if (mag > 1) {
    mf /= mag;
    mr /= mag;
  }
  s.sprint = inp.sprint && mag > 0.15;
  const maxSp = s.event === "trip" ? 0.7 : s.sprint ? 5.35 : 2.55;
  const wishX = fx * mf + rx * mr;
  const wishZ = fz * mf + rz * mr;
  s.vx += (wishX * maxSp - s.vx) * (1 - Math.exp(-dt * 8));
  s.vz += (wishZ * maxSp - s.vz) * (1 - Math.exp(-dt * 8));
  if (mag < 0.08) {
    s.vx *= Math.exp(-dt * 6);
    s.vz *= Math.exp(-dt * 6);
  }
  let nx = s.px + s.vx * dt;
  let nz = s.pz + s.vz * dt;
  const hit = collide(nx, nz, 0.38);
  s.px = hit.x;
  s.pz = hit.z;
  s.speed = Math.hypot(s.vx, s.vz);
  s.walkPhase += s.speed * dt * 5.5;
  const bob = Math.sin(s.walkPhase) * Math.min(s.speed, 4.2) * 0.018;
  s.eyeT = s.event === "trip" ? 0.28 : 1.58;
  s.eye += (s.eyeT + bob - s.eye) * (1 - Math.exp(-dt * 8));

  const dist = hypot2(s.px - FIGHT.x, s.pz - FIGHT.z);
  let panicT = 0.16 + (s.sprint ? 0.28 : 0) + (dist < 1.8 ? 0.25 : 0);
  if (s.pendingHit) panicT += 0.35;
  s.panic += (panicT - s.panic) * (1 - Math.exp(-dt * 1.4));
  s.panic = clamp(s.panic, 0.08, 1);
  s.roll = s.panic * 0.11 * Math.sin(s.animTime * 2.05) + s.impYaw * 0.12;

  if (inp.panic) startEvent(s, "commentary");

  const qa =
    typeof window !== "undefined" && /\bqa=1\b/.test(window.location.search);
  if (!qa) {
    if (s.event !== "none") {
      s.eventT += dt;
      if (s.eventT >= s.eventDur) {
        s.event = "none";
        s.eventCd = 3.2 + Math.random() * 4.2 - s.panic * 1.6;
        s.eyeT = 1.58;
      }
    } else {
      s.eventCd -= dt;
      if (s.takeTime > 1.6 && s.eventCd <= 0) startEvent(s, pickEvent(s));
    }
  }

  if (dist < 1.35 && s.event === "none") {
    const punching = s.f.some((f) => f.state === "punch");
    if (punching && Math.random() < dt * 1.8) startEvent(s, "shove");
  }

  if (!s.wantEnd && (s.takeTime >= TAKE_LEN || (s.fightOver && s.aftermath > 4.2))) {
    s.wantEnd = true;
  }
}

export function scoreFrame(
  visible: (x: number, y: number, z: number) => boolean,
  dt: number,
) {
  const s = sim;
  if (s.wantEnd) return;
  const v0 = visible(s.f[0].x, 1.15, s.f[0].z);
  const v1 = visible(s.f[1].x, 1.15, s.f[1].z);
  s.inFrame = ((v0 ? 1 : 0) + (v1 ? 1 : 0)) as 0 | 1 | 2;
  const dist = hypot2(s.px - FIGHT.x, s.pz - FIGHT.z);
  const shake = clamp(s.panic * 0.7 + (s.sprint ? 0.35 : 0) + s.speed * 0.04, 0, 1);
  let q = s.inFrame === 2 ? 1 : s.inFrame === 1 ? 0.34 : 0;
  if (s.pitch < -0.72 || s.event === "feet") {
    q = 0;
    s.stats.feet += dt;
  } else if (s.pitch > 0.58 || s.event === "sky") {
    q = 0;
    s.stats.sky += dt;
  } else if (s.inFrame === 0) {
    s.stats.wall += dt;
  } else {
    s.stats.subject += dt;
  }
  if (dist < 1.55) q *= 0.38;
  if (dist > 11) q *= 0.22;
  if (s.zoom > 2.65) q *= 0.62;
  q *= 1 - shake * 0.55;
  if (s.event === "finger" || s.event === "focus") q *= 0.25;
  s.score += q * 92 * dt;
  s.viral += (q * 100 - s.viral) * (1 - Math.exp(-dt * 2.4));
  s.viral = clamp(s.viral, 0, 100);

  if (s.pendingHit && !s.pendingHit.seen) {
    const seen = visible(s.pendingHit.x, 1.2, s.pendingHit.z);
    s.pendingHit.seen = true;
    if (seen) {
      const pts = s.pendingHit.down ? 760 : s.pendingHit.heavy ? 430 : 210;
      s.score += pts;
      s.clips += 1;
      s.stats.punchesSeen += 1;
      s.flash = s.pendingHit.down ? "HE'S DOWN" : "CLIP";
      s.flashT = 0.85;
      s.viral = clamp(s.viral + (s.pendingHit.down ? 28 : 12), 0, 100);
    }
  }

  s.note = directorNote(s);
}

export function directorNote(s: Sim): string {
  if (s.event === "finger") return "Finger. On. The. Lens.";
  if (s.event === "focus") return "Hunting focus like a lost tourist.";
  if (s.event === "zoom") return "Zooming like you've never held a phone.";
  if (s.event === "whip") return "Whip-pan to absolutely nothing.";
  if (s.event === "trip") return "You fell. The fight did not.";
  if (s.event === "shove") return "Too close. That's a punch, pal.";
  if (s.event === "flash") return "Night flash. Very professional.";
  if (s.event === "feet") return "Award-winning tarmac.";
  if (s.event === "sky") return "Yes, the clouds are also fighting.";
  if (s.event === "commentary") return "Stop shouting. Keep filming.";
  if (s.pitch < -0.72) return "That's pavement.";
  if (s.pitch > 0.62) return "Sky. Still not the fight.";
  if (s.inFrame === 0) {
    const face = Math.atan2(FIGHT.x - s.px, FIGHT.z - s.pz);
    const off = Math.abs(angWrap(face - s.yaw));
    if (off > 1.05) return "They're behind you.";
    return "Lovely brick. Shame about the fight.";
  }
  const d = hypot2(s.px - FIGHT.x, s.pz - FIGHT.z);
  if (d < 1.5) return "You're in the scrap now.";
  if (d > 11) return "That's a rumour of a fight.";
  if (s.zoom > 2.7) return "Pore-level cinema. Pull back.";
  if (s.sprint) return "Running like the ten o'clock news.";
  if (s.panic > 0.78) return "Breathe. You're making it worse.";
  if (s.inFrame === 1) return "You lost one of them.";
  if (s.viral > 72) return "It's usable. Don't get excited.";
  return "Stay on them. Sort of.";
}

export function summarize(s: Sim): TakeResults {
  const subjectPct = Math.round((s.stats.subject / Math.max(s.takeTime, 1)) * 100);
  let grade = "F";
  if (s.score >= 7200) grade = "S";
  else if (s.score >= 5200) grade = "A";
  else if (s.score >= 3600) grade = "B";
  else if (s.score >= 2200) grade = "C";
  else if (s.score >= 1100) grade = "D";
  const head: Record<string, string> = {
    S: "You meant to be this bad. That's worse. The algorithm will eat it alive.",
    A: "Viral. Unwatchable. A perfect modern document.",
    B: "You caught the knockdown and then filmed a Vauxhall for eight seconds.",
    C: "One usable punch. The rest is cement, sky, and vibes.",
    D: "The algorithm will file this under civil engineering.",
    F: "Delete this. You filmed a car park with extra steps.",
  };
  const extras: string[] = [`${subjectPct}% on the actual fight.`];
  if (s.stats.feet > 5) extras.push(`${Math.floor(s.stats.feet)}s of pavement.`);
  if (s.stats.sky > 4) extras.push(`${Math.floor(s.stats.sky)}s of sky.`);
  if (s.stats.hitsTaken > 0) {
    extras.push(
      `Got clipped ${s.stats.hitsTaken} time${s.stats.hitsTaken === 1 ? "" : "s"}.`,
    );
  }
  if (s.stats.fingers > 0) extras.push(`Finger on the lens ${s.stats.fingers}×.`);
  extras.push(
    s.clips === 0 ? "Zero clips. Historic." : `${s.clips} clip${s.clips === 1 ? "" : "s"} salvageable.`,
  );
  s.grade = grade;
  s.roast = `${head[grade] ?? head.F} ${extras.join(" ")}`;
  return {
    score: Math.round(s.score),
    clips: s.clips,
    grade,
    roast: s.roast,
    viral: Math.round(s.viral),
    subjectPct,
    feet: Math.round(s.stats.feet),
    sky: Math.round(s.stats.sky),
    hitsTaken: s.stats.hitsTaken,
    fingers: s.stats.fingers,
    punchesSeen: s.stats.punchesSeen,
  };
}

export function attachControlsTest() {
  window.__controlsTest = {
    getYaw: () => sim.yaw,
    getSpeed: () => sim.speed,
    getPosition: () => ({ x: sim.px, z: sim.pz }),
    setKeys: (codes: string[]) => {
      input.keys.clear();
      for (const c of codes) input.keys.add(c);
    },
    endTake: () => {
      sim.wantEnd = true;
    },
  };
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getPosition: () => { x: number; z: number };
      setKeys?: (codes: string[]) => void;
      endTake?: () => void;
    };
  }
}
