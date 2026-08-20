import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { a as signOut, r as getBearerToken, t as authClient } from "./client-DhSpiK8Y.mjs";
import { t as authMiddleware } from "./middleware-BCn4hhGU.mjs";
import { n as cn, t as Button } from "./button-CA91MQf2.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DBC29-F1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIGHT = {
	x: 0,
	z: 0
};
var SPAWN = {
	x: 5.2,
	z: 8.4
};
var PUB = {
	x: -12,
	z: 0,
	w: 8,
	d: 12,
	h: 5.2
};
var CARS = [
	{
		x: 8.6,
		z: -2.4,
		rot: .18,
		w: 1.7,
		l: 4.2,
		color: "#cfd3d8",
		cabin: "#8b949e",
		kind: "van"
	},
	{
		x: 9.4,
		z: 3.6,
		rot: -.42,
		w: 1.55,
		l: 3.5,
		color: "#1a1d22",
		cabin: "#0c0e12",
		kind: "car"
	},
	{
		x: -3.4,
		z: 10.6,
		rot: 1.48,
		w: 1.6,
		l: 3.8,
		color: "#3a322e",
		cabin: "#1d1816",
		kind: "car"
	}
];
var LAMPS = [
	{
		x: -6.2,
		z: 7.4
	},
	{
		x: 5.6,
		z: 6.8
	},
	{
		x: -5.4,
		z: -7.2
	}
];
var BIN = {
	x: 3.6,
	z: -7.1
};
var BOLLARDS = [
	{
		x: -7.6,
		z: 5.4
	},
	{
		x: -7.6,
		z: 3.6
	},
	{
		x: -7.6,
		z: -3.6
	},
	{
		x: -7.6,
		z: -5.4
	}
];
function carAabb(c) {
	const pad = .28;
	const hw = (Math.abs(Math.cos(c.rot)) * c.w + Math.abs(Math.sin(c.rot)) * c.l) / 2 + pad;
	const hd = (Math.abs(Math.sin(c.rot)) * c.w + Math.abs(Math.cos(c.rot)) * c.l) / 2 + pad;
	return {
		x0: c.x - hw,
		x1: c.x + hw,
		z0: c.z - hd,
		z1: c.z + hd
	};
}
var BOXES = [
	{
		x0: -16.2,
		x1: -7.85,
		z0: -6.2,
		z1: 6.2
	},
	{
		x0: -16.5,
		x1: 16.5,
		z0: -15.6,
		z1: -14.55
	},
	{
		x0: -17.5,
		x1: -16.15,
		z0: -15.5,
		z1: 12.5
	},
	{
		x0: 3.05,
		x1: 4.2,
		z0: -7.65,
		z1: -6.55
	},
	...CARS.map(carAabb)
];
var CROWD = Array.from({ length: 8 }, (_, i) => {
	const ang = i / 8 * Math.PI * 2 + .31;
	const r = 4.55 + i % 3 * .28;
	return {
		ang,
		r,
		x: Math.cos(ang) * r,
		z: Math.sin(ang) * r,
		phone: i % 2 === 0,
		scale: .94 + i % 3 * .05,
		shirt: i % 4
	};
});
var input = {
	keys: /* @__PURE__ */ new Set(),
	lookX: 0,
	lookY: 0,
	zoomDelta: 0,
	joyX: 0,
	joyY: 0,
	panicQueued: false,
	pointerLocked: false,
	isTouch: false,
	target: null
};
function isTypingTarget(el) {
	if (!(el instanceof HTMLElement)) return false;
	const tag = el.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}
function onKeyDown(e) {
	if (isTypingTarget(e.target)) return;
	input.keys.add(e.code);
	if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") e.preventDefault();
	if (e.code === "Space") input.panicQueued = true;
}
function onKeyUp(e) {
	input.keys.delete(e.code);
}
function onMouseMove(e) {
	if (!input.pointerLocked) return;
	input.lookX += e.movementX;
	input.lookY += e.movementY;
}
function onWheel(e) {
	if (!input.pointerLocked) return;
	e.preventDefault();
	input.zoomDelta += e.deltaY > 0 ? -.35 : .35;
}
function onLockChange() {
	input.pointerLocked = document.pointerLockElement != null;
}
function onBlur() {
	input.keys.clear();
}
function detectTouch() {
	if (typeof window === "undefined") return false;
	input.isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window || window.innerWidth < 700;
	return input.isTouch;
}
function setLockTarget(el) {
	input.target = el;
}
function lockPointer() {
	if (input.isTouch) return;
	input.target?.requestPointerLock();
}
function consumeLook() {
	const x = input.lookX;
	const y = input.lookY;
	input.lookX = 0;
	input.lookY = 0;
	return {
		x,
		y
	};
}
function consumeZoom() {
	const z = input.zoomDelta;
	input.zoomDelta = 0;
	return z;
}
function consumePanic() {
	const p = input.panicQueued;
	input.panicQueued = false;
	return p;
}
function attachInput() {
	detectTouch();
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("wheel", onWheel, { passive: false });
	document.addEventListener("pointerlockchange", onLockChange);
	window.addEventListener("blur", onBlur);
	document.addEventListener("visibilitychange", onBlur);
}
function detachInput() {
	window.removeEventListener("keydown", onKeyDown);
	window.removeEventListener("keyup", onKeyUp);
	window.removeEventListener("mousemove", onMouseMove);
	window.removeEventListener("wheel", onWheel);
	document.removeEventListener("pointerlockchange", onLockChange);
	window.removeEventListener("blur", onBlur);
	document.removeEventListener("visibilitychange", onBlur);
	input.keys.clear();
}
function held(code) {
	return input.keys.has(code);
}
var SHOUTS = [
	"OI OI OI",
	"LEAVE IT",
	"WHOA WHOA",
	"GET HIM",
	"PHONE UP",
	"HAVE IT",
	"NO NO NO",
	"HE'S DOWN"
];
var EVENTS$1 = [
	{
		kind: "whip",
		w: 2.2
	},
	{
		kind: "feet",
		w: 1.8
	},
	{
		kind: "sky",
		w: 1.1
	},
	{
		kind: "zoom",
		w: 2
	},
	{
		kind: "finger",
		w: 1.8
	},
	{
		kind: "focus",
		w: 1.2
	},
	{
		kind: "trip",
		w: .7
	},
	{
		kind: "flash",
		w: .45
	}
];
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
function angWrap(a) {
	return Math.atan2(Math.sin(a), Math.cos(a));
}
function hypot2(x, z) {
	return Math.hypot(x, z);
}
function collide(x, z, r) {
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
	return {
		x,
		z
	};
}
function makeFighter(side) {
	return {
		x: side * 1.15,
		z: .2 * side,
		yaw: side > 0 ? -Math.PI / 2 : Math.PI / 2,
		hp: 100,
		downs: 0,
		state: "idle",
		t: 0,
		punch: 0,
		walk: 0,
		downAmt: 0,
		kind: "none",
		power: 0
	};
}
function buildScript() {
	const beats = [];
	let t = 1.35;
	let who = 0;
	while (t < 76) {
		const roll = Math.random();
		const kind = roll < .12 ? "haymaker" : roll < .42 ? "jab" : "cross";
		beats.push({
			who,
			kind,
			at: t
		});
		t += kind === "haymaker" ? 1.55 + Math.random() * .4 : .62 + Math.random() * .55;
		if (Math.random() < .72) who = 1 - who;
	}
	return beats;
}
function makeSim() {
	return {
		animTime: 0,
		takeTime: 0,
		px: SPAWN.x,
		pz: SPAWN.z,
		yaw: Math.atan2(SPAWN.x, SPAWN.z),
		pitch: -.08,
		roll: 0,
		vx: 0,
		vz: 0,
		speed: 0,
		zoom: 1,
		zoomT: 1,
		zoomV: 0,
		panic: .22,
		sprint: false,
		event: "none",
		eventT: 0,
		eventDur: 0,
		eventCd: 2.6,
		eye: 1.58,
		eyeT: 1.58,
		score: 0,
		viral: 12,
		clips: 0,
		battery: 17,
		inFrame: 0,
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
		pendingHit: null,
		crowdRecoil: 0,
		walkPhase: 0,
		impYaw: 0,
		impPitch: 0,
		f: [makeFighter(1), makeFighter(-1)],
		script: buildScript(),
		scriptI: 0,
		stats: {
			subject: 0,
			feet: 0,
			sky: 0,
			wall: 0,
			hitsTaken: 0,
			fingers: 0,
			punchesSeen: 0
		},
		grade: "F",
		roast: ""
	};
}
var sim = makeSim();
function resetSim() {
	Object.assign(sim, makeSim());
}
function pickEvent(s) {
	const moving = s.speed > 1.4;
	let total = 0;
	const bag = [];
	for (const e of EVENTS$1) {
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
function startEvent(s, kind) {
	s.event = kind;
	s.eventT = 0;
	s.eventDur = kind === "flash" ? .18 : kind === "whip" ? .7 : kind === "trip" ? 1.15 : 1.05 + Math.random() * .7;
	s.panic = clamp(s.panic + .18, 0, 1);
	if (kind === "whip") s.impYaw = (Math.random() < .5 ? 1 : -1) * (.85 + Math.random() * .45);
	if (kind === "feet") s.impPitch = -.7;
	if (kind === "sky") s.impPitch = .62;
	if (kind === "trip") {
		s.eyeT = .28;
		s.impPitch = -.55;
		s.impYaw += (Math.random() - .5) * .4;
	}
	if (kind === "zoom") s.zoomT = Math.random() < .5 ? 3.4 : 1.05;
	if (kind === "finger") s.stats.fingers += 1;
	if (kind === "flash") s.flashT = .16;
	if (kind === "commentary") {
		s.caption = SHOUTS[Math.random() * SHOUTS.length | 0] ?? "OI";
		s.captionT = 1.15;
		s.impYaw += (Math.random() - .5) * .25;
		s.panic = clamp(s.panic + .22, 0, 1);
	}
	if (kind === "shove") {
		s.stats.hitsTaken += 1;
		s.impYaw += (Math.random() < .5 ? 1 : -1) * .7;
		s.impPitch -= .25;
		const dx = s.px - FIGHT.x;
		const dz = s.pz - FIGHT.z;
		const d = Math.max(.4, hypot2(dx, dz));
		s.vx += dx / d * 6.5;
		s.vz += dz / d * 6.5;
		s.flash = "YOU GOT CLIPPED";
		s.flashT = .7;
	}
}
function windupTime(kind) {
	if (kind === "haymaker") return .52;
	if (kind === "cross") return .26;
	return .16;
}
function punchPower(kind) {
	if (kind === "haymaker") return 22;
	if (kind === "cross") return 13;
	return 8;
}
function updateFighters(s, dt, live) {
	const t = s.animTime;
	for (let i = 0; i < 2; i += 1) {
		const f = s.f[i];
		const o = s.f[1 - i];
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
			if (f.downAmt <= .02) {
				f.downAmt = 0;
				f.state = "idle";
				f.t = 0;
			}
			continue;
		}
		const ang = t * .55 + i * Math.PI;
		const r = 1.08 + .1 * Math.sin(t * 1.7 + i);
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
			const d = Math.max(.4, hypot2(dx, dz));
			f.x += dx / d * 1.1 * dt;
			f.z += dz / d * 1.1 * dt;
			if (f.t > .28) {
				f.state = "idle";
				f.t = 0;
			}
			continue;
		}
		if (f.state === "windup") {
			f.punch = clamp(f.t / Math.max(.12, windupTime(f.kind) * .7), 0, .45);
			if (f.t >= windupTime(f.kind)) {
				f.state = "punch";
				f.t = 0;
			}
			continue;
		}
		if (f.state === "punch") {
			f.punch = .45 + Math.min(1, f.t / .08) * .55;
			const reach = hypot2(o.x - f.x, o.z - f.z);
			if (f.t < .11 && reach < 1.62 && o.state !== "down" && o.state !== "getup") {
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
				s.pendingHit = {
					x: (f.x + o.x) * .5,
					z: (f.z + o.z) * .5,
					heavy,
					down,
					seen: false
				};
				s.crowdRecoil = 1;
				const dx = o.x - f.x;
				const dz = o.z - f.z;
				const d = Math.max(.3, hypot2(dx, dz));
				o.x += dx / d * (heavy ? .55 : .28);
				o.z += dz / d * (heavy ? .55 : .28);
			}
			if (f.t > .14) {
				f.state = "recover";
				f.t = 0;
			}
			continue;
		}
		if (f.state === "recover") {
			f.punch = clamp(f.punch - dt * 2.6, 0, 1);
			if (f.t > .32) {
				f.state = "idle";
				f.t = 0;
				f.kind = "none";
			}
		}
	}
	if (!live || s.fightOver) return;
	while (s.scriptI < s.script.length && s.script[s.scriptI].at <= s.takeTime) {
		const beat = s.script[s.scriptI];
		s.scriptI += 1;
		const f = s.f[beat.who];
		if (f.state !== "idle" && f.state !== "recover") continue;
		if (s.f[1 - beat.who].state === "down") continue;
		f.state = "windup";
		f.t = 0;
		f.kind = beat.kind;
		f.power = punchPower(beat.kind);
	}
}
function tickSim(dt, inp) {
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
	s.battery = clamp(17 - s.takeTime / 68 * 13, 3.5, 18);
	if (s.takeTime > 59) s.sirens = true;
	if (s.fightOver) s.aftermath += dt;
	s.yaw -= inp.lookX * .00215;
	s.pitch -= inp.lookY * .002;
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
	s.zoomT += (1.15 - s.zoomT) * dt * .07;
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
	s.sprint = inp.sprint && mag > .15;
	const maxSp = s.event === "trip" ? .7 : s.sprint ? 5.35 : 2.55;
	const wishX = fx * mf + rx * mr;
	const wishZ = fz * mf + rz * mr;
	s.vx += (wishX * maxSp - s.vx) * (1 - Math.exp(-dt * 8));
	s.vz += (wishZ * maxSp - s.vz) * (1 - Math.exp(-dt * 8));
	if (mag < .08) {
		s.vx *= Math.exp(-dt * 6);
		s.vz *= Math.exp(-dt * 6);
	}
	const hit = collide(s.px + s.vx * dt, s.pz + s.vz * dt, .38);
	s.px = hit.x;
	s.pz = hit.z;
	s.speed = Math.hypot(s.vx, s.vz);
	s.walkPhase += s.speed * dt * 5.5;
	const bob = Math.sin(s.walkPhase) * Math.min(s.speed, 4.2) * .018;
	s.eyeT = s.event === "trip" ? .28 : 1.58;
	s.eye += (s.eyeT + bob - s.eye) * (1 - Math.exp(-dt * 8));
	const dist = hypot2(s.px - FIGHT.x, s.pz - FIGHT.z);
	let panicT = .16 + (s.sprint ? .28 : 0) + (dist < 1.8 ? .25 : 0);
	if (s.pendingHit) panicT += .35;
	s.panic += (panicT - s.panic) * (1 - Math.exp(-dt * 1.4));
	s.panic = clamp(s.panic, .08, 1);
	s.roll = s.panic * .11 * Math.sin(s.animTime * 2.05) + s.impYaw * .12;
	if (inp.panic) startEvent(s, "commentary");
	if (!(typeof window !== "undefined" && /\bqa=1\b/.test(window.location.search))) {
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
		if (s.f.some((f) => f.state === "punch") && Math.random() < dt * 1.8) startEvent(s, "shove");
	}
	if (!s.wantEnd && (s.takeTime >= 68 || s.fightOver && s.aftermath > 4.2)) s.wantEnd = true;
}
function scoreFrame(visible, dt) {
	const s = sim;
	if (s.wantEnd) return;
	const v0 = visible(s.f[0].x, 1.15, s.f[0].z);
	const v1 = visible(s.f[1].x, 1.15, s.f[1].z);
	s.inFrame = (v0 ? 1 : 0) + (v1 ? 1 : 0);
	const dist = hypot2(s.px - FIGHT.x, s.pz - FIGHT.z);
	const shake = clamp(s.panic * .7 + (s.sprint ? .35 : 0) + s.speed * .04, 0, 1);
	let q = s.inFrame === 2 ? 1 : s.inFrame === 1 ? .34 : 0;
	if (s.pitch < -.72 || s.event === "feet") {
		q = 0;
		s.stats.feet += dt;
	} else if (s.pitch > .58 || s.event === "sky") {
		q = 0;
		s.stats.sky += dt;
	} else if (s.inFrame === 0) s.stats.wall += dt;
	else s.stats.subject += dt;
	if (dist < 1.55) q *= .38;
	if (dist > 11) q *= .22;
	if (s.zoom > 2.65) q *= .62;
	q *= 1 - shake * .55;
	if (s.event === "finger" || s.event === "focus") q *= .25;
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
			s.flashT = .85;
			s.viral = clamp(s.viral + (s.pendingHit.down ? 28 : 12), 0, 100);
		}
	}
	s.note = directorNote(s);
}
function directorNote(s) {
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
	if (s.pitch < -.72) return "That's pavement.";
	if (s.pitch > .62) return "Sky. Still not the fight.";
	if (s.inFrame === 0) {
		const face = Math.atan2(FIGHT.x - s.px, FIGHT.z - s.pz);
		if (Math.abs(angWrap(face - s.yaw)) > 1.05) return "They're behind you.";
		return "Lovely brick. Shame about the fight.";
	}
	const d = hypot2(s.px - FIGHT.x, s.pz - FIGHT.z);
	if (d < 1.5) return "You're in the scrap now.";
	if (d > 11) return "That's a rumour of a fight.";
	if (s.zoom > 2.7) return "Pore-level cinema. Pull back.";
	if (s.sprint) return "Running like the ten o'clock news.";
	if (s.panic > .78) return "Breathe. You're making it worse.";
	if (s.inFrame === 1) return "You lost one of them.";
	if (s.viral > 72) return "It's usable. Don't get excited.";
	return "Stay on them. Sort of.";
}
function summarize(s) {
	const subjectPct = Math.round(s.stats.subject / Math.max(s.takeTime, 1) * 100);
	let grade = "F";
	if (s.score >= 7200) grade = "S";
	else if (s.score >= 5200) grade = "A";
	else if (s.score >= 3600) grade = "B";
	else if (s.score >= 2200) grade = "C";
	else if (s.score >= 1100) grade = "D";
	const head = {
		S: "You meant to be this bad. That's worse. The algorithm will eat it alive.",
		A: "Viral. Unwatchable. A perfect modern document.",
		B: "You caught the knockdown and then filmed a Vauxhall for eight seconds.",
		C: "One usable punch. The rest is cement, sky, and vibes.",
		D: "The algorithm will file this under civil engineering.",
		F: "Delete this. You filmed a car park with extra steps."
	};
	const extras = [`${subjectPct}% on the actual fight.`];
	if (s.stats.feet > 5) extras.push(`${Math.floor(s.stats.feet)}s of pavement.`);
	if (s.stats.sky > 4) extras.push(`${Math.floor(s.stats.sky)}s of sky.`);
	if (s.stats.hitsTaken > 0) extras.push(`Got clipped ${s.stats.hitsTaken} time${s.stats.hitsTaken === 1 ? "" : "s"}.`);
	if (s.stats.fingers > 0) extras.push(`Finger on the lens ${s.stats.fingers}×.`);
	extras.push(s.clips === 0 ? "Zero clips. Historic." : `${s.clips} clip${s.clips === 1 ? "" : "s"} salvageable.`);
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
		punchesSeen: s.stats.punchesSeen
	};
}
function attachControlsTest() {
	window.__controlsTest = {
		getYaw: () => sim.yaw,
		getSpeed: () => sim.speed,
		getPosition: () => ({
			x: sim.px,
			z: sim.pz
		}),
		setKeys: (codes) => {
			input.keys.clear();
			for (const c of codes) input.keys.add(c);
		},
		endTake: () => {
			sim.wantEnd = true;
		}
	};
}
function makeNoise(ctx, seconds) {
	const n = Math.floor(ctx.sampleRate * seconds);
	const buf = ctx.createBuffer(1, n, ctx.sampleRate);
	const data = buf.getChannelData(0);
	for (let i = 0; i < n; i += 1) data[i] = Math.random() * 2 - 1;
	return buf;
}
function createTapeAudio() {
	let ctx = null;
	let crowdGain = null;
	let crowdSrc = null;
	let heat = .08;
	function ensure() {
		if (!ctx) ctx = new AudioContext();
		if (ctx.state === "suspended") ctx.resume();
		return ctx;
	}
	return {
		unlock() {
			ensure();
		},
		recBeep() {
			const ac = ensure();
			const t = ac.currentTime;
			const o = ac.createOscillator();
			const g = ac.createGain();
			o.type = "square";
			o.frequency.value = 1480;
			g.gain.setValueAtTime(.08, t);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .09);
			o.connect(g);
			g.connect(ac.destination);
			o.start(t);
			o.stop(t + .1);
		},
		punch(heavy) {
			const ac = ensure();
			const t = ac.currentTime;
			const o = ac.createOscillator();
			const g = ac.createGain();
			o.type = "sine";
			o.frequency.setValueAtTime(heavy ? 64 : 108, t);
			o.frequency.exponentialRampToValueAtTime(28, t + .14);
			g.gain.setValueAtTime(heavy ? .42 : .24, t);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .16);
			o.connect(g);
			g.connect(ac.destination);
			o.start(t);
			o.stop(t + .17);
			const src = ac.createBufferSource();
			src.buffer = makeNoise(ac, .08);
			const bp = ac.createBiquadFilter();
			bp.type = "bandpass";
			bp.frequency.value = heavy ? 420 : 900;
			bp.Q.value = .7;
			const ng = ac.createGain();
			ng.gain.setValueAtTime(heavy ? .22 : .12, t);
			ng.gain.exponentialRampToValueAtTime(1e-4, t + .09);
			src.connect(bp);
			bp.connect(ng);
			ng.connect(ac.destination);
			src.start(t);
		},
		whoa() {
			const ac = ensure();
			const t = ac.currentTime;
			const o = ac.createOscillator();
			const g = ac.createGain();
			o.type = "triangle";
			o.frequency.setValueAtTime(220, t);
			o.frequency.exponentialRampToValueAtTime(140, t + .18);
			g.gain.setValueAtTime(.07, t);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .2);
			o.connect(g);
			g.connect(ac.destination);
			o.start(t);
			o.stop(t + .22);
		},
		shove() {
			const ac = ensure();
			const t = ac.currentTime;
			const src = ac.createBufferSource();
			src.buffer = makeNoise(ac, .16);
			const lp = ac.createBiquadFilter();
			lp.type = "lowpass";
			lp.frequency.value = 280;
			const g = ac.createGain();
			g.gain.setValueAtTime(.28, t);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .18);
			src.connect(lp);
			lp.connect(g);
			g.connect(ac.destination);
			src.start(t);
		},
		startCrowd() {
			const ac = ensure();
			this.stopCrowd();
			const src = ac.createBufferSource();
			src.buffer = makeNoise(ac, 2);
			src.loop = true;
			const lp = ac.createBiquadFilter();
			lp.type = "lowpass";
			lp.frequency.value = 480;
			const g = ac.createGain();
			g.gain.value = heat;
			src.connect(lp);
			lp.connect(g);
			g.connect(ac.destination);
			src.start();
			crowdSrc = src;
			crowdGain = g;
		},
		stopCrowd() {
			try {
				crowdSrc?.stop();
			} catch {}
			crowdSrc = null;
			crowdGain = null;
		},
		setCrowdHeat(v) {
			heat = .05 + v * .12;
			if (crowdGain && ctx) crowdGain.gain.setTargetAtTime(heat, ctx.currentTime, .2);
		},
		siren() {
			const ac = ensure();
			const t = ac.currentTime;
			for (let i = 0; i < 6; i += 1) {
				const o = ac.createOscillator();
				const g = ac.createGain();
				o.type = "sine";
				o.frequency.value = i % 2 === 0 ? 680 : 910;
				const start = t + i * .28;
				g.gain.setValueAtTime(1e-4, start);
				g.gain.exponentialRampToValueAtTime(.07, start + .04);
				g.gain.exponentialRampToValueAtTime(1e-4, start + .26);
				o.connect(g);
				g.connect(ac.destination);
				o.start(start);
				o.stop(start + .28);
			}
		}
	};
}
var tapeAudio = createTapeAudio();
var initial = {
	phase: "menu",
	takeTime: 0,
	takeLen: 68,
	score: 0,
	viral: 0,
	clips: 0,
	zoom: 1,
	battery: 18,
	note: "Keep them in frame. You won't.",
	event: "none",
	flash: "",
	caption: "",
	inFrame: 0,
	missing: false,
	sirens: false,
	results: null,
	tapeUrl: null,
	tapeMime: "",
	tapeRoll: "idle",
	tapeSaved: false,
	tapeSaving: false,
	tapeId: null,
	replayFrom: "results"
};
var useTape = create((set) => ({
	...initial,
	set: (p) => set(p)
}));
function resetHud() {
	const prev = useTape.getState().tapeUrl;
	if (prev) URL.revokeObjectURL(prev);
	useTape.setState({
		...initial,
		phase: "playing",
		tapeRoll: "recording"
	});
}
var MAX_BYTES = 24e5;
var STEP = 1 / 10;
var EVENTS = [
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
	"commentary"
];
var keys = [];
var packed = null;
var replayTime = 0;
var lastBlob = null;
var lastMime = "";
var rec = null;
var chunks = [];
var mime = "";
var glStream = null;
var track = null;
function pickMime() {
	const types = [
		"video/webm;codecs=vp8",
		"video/webm",
		"video/mp4;codecs=avc1.42E01E",
		"video/mp4"
	];
	if (typeof MediaRecorder === "undefined") return "";
	return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}
function r(v, n = 3) {
	const m = 10 ** n;
	return Math.round(v * m) / m;
}
function evCode(e) {
	const i = EVENTS.indexOf(e);
	return i < 0 ? 0 : i;
}
function sample() {
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
		r(b.downAmt, 2)
	];
}
function lastTape() {
	return lastBlob ? {
		blob: lastBlob,
		mime: lastMime
	} : null;
}
function lastReplay() {
	return packed;
}
function setReplay(data) {
	packed = data;
	replayTime = 0;
}
function advanceReplay(dt) {
	replayTime += dt;
	return replayTime;
}
function replayNow() {
	return replayTime;
}
function stampTape(src, _hud) {
	const lastT = keys.length ? keys[keys.length - 1][0] : -1;
	if (sim.takeTime - lastT >= STEP) keys.push(sample());
	(src.getContext("webgl2") || src.getContext("webgl"))?.flush();
	track?.requestFrame?.();
}
function beginTape(glCanvas) {
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
			videoBitsPerSecond: 4e5
		});
		rec.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};
		rec.start();
		track?.requestFrame?.();
	} catch {
		rec = null;
		glStream = null;
		track = null;
	}
}
function abortTape() {
	if (rec && rec.state !== "inactive") try {
		rec.stop();
	} catch {}
	rec = null;
	chunks = [];
	track = null;
	if (glStream) for (const t of glStream.getTracks()) t.stop();
	glStream = null;
}
async function finishTape() {
	packed = {
		keys: keys.slice(),
		len: sim.takeTime
	};
	const recorder = rec;
	rec = null;
	if (recorder && recorder.state === "recording") try {
		recorder.requestData();
	} catch {}
	const fromRecorder = await new Promise((resolve) => {
		let settled = false;
		const done = (b) => {
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
	if (glStream) for (const t of glStream.getTracks()) t.stop();
	glStream = null;
	const blob = fromRecorder;
	const outMime = mime || blob?.type || "video/webm";
	if (!blob || blob.size < 4e3) return null;
	if (blob.size > MAX_BYTES) return null;
	chunks = [];
	lastBlob = blob;
	lastMime = outMime;
	return {
		blob,
		mime: outMime
	};
}
function applyKeyToSim(k) {
	sim.px = k[1];
	sim.pz = k[2];
	sim.eye = k[3];
	sim.yaw = k[4];
	sim.pitch = k[5];
	sim.roll = k[6];
	sim.zoom = k[7];
	sim.event = EVENTS[k[8]] ?? "none";
	const a = sim.f[0];
	const b = sim.f[1];
	a.x = k[9];
	a.z = k[10];
	a.yaw = k[11];
	a.state = k[12] === 2 ? "down" : k[12] === 1 ? "punch" : "idle";
	a.punch = k[13];
	a.downAmt = k[14];
	b.x = k[15];
	b.z = k[16];
	b.yaw = k[17];
	b.state = k[18] === 2 ? "down" : k[18] === 1 ? "punch" : "idle";
	b.punch = k[19];
	b.downAmt = k[20];
}
function keyAt(tape, t) {
	const ks = tape.keys;
	if (!ks.length) return null;
	let lo = 0;
	let hi = ks.length - 1;
	while (lo < hi) {
		const mid = lo + hi >> 1;
		if (ks[mid][0] < t) lo = mid + 1;
		else hi = mid;
	}
	const b = ks[lo];
	const a = ks[Math.max(0, lo - 1)];
	const t0 = a[0];
	const t1 = b[0];
	const u = t1 - t0 > .001 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 1;
	const out = a.slice();
	for (let i = 1; i < a.length; i += 1) if (i === 8 || i === 12 || i === 18) out[i] = u < .5 ? a[i] : b[i];
	else out[i] = a[i] + (b[i] - a[i]) * u;
	return out;
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var saveTake = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({
	score: Math.max(0, Math.min(999999, Math.floor(Number(data.score) || 0))),
	clips: Math.max(0, Math.min(999, Math.floor(Number(data.clips) || 0))),
	grade: String(data.grade ?? "F").slice(0, 2),
	roast: String(data.roast ?? "").slice(0, 400)
})).handler(createSsrRpc("f990dd147cace07b7dc2ecb98d89ea46921f80e52400fa245256e7b4dfff3696"));
var listTakes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("084c683e444b98c46100f562eaa96b0bedae4b01161dc132f3ce66293638aeb0"));
var DB_NAME = "bad-angle";
var STORE = "pending";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function stashPendingTape(entry) {
	try {
		const db = await openDb();
		await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(entry, "last");
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
		db.close();
	} catch {}
}
async function readPendingTape() {
	try {
		const db = await openDb();
		const row = await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get("last");
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => reject(req.error);
		});
		db.close();
		return row;
	} catch {
		return null;
	}
}
async function clearPendingTape() {
	try {
		const db = await openDb();
		await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).delete("last");
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
		db.close();
	} catch {}
}
function authHeaders() {
	const token = getBearerToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}
async function uploadTape(meta, replay, blob, mime) {
	const fd = new FormData();
	fd.set("replay", JSON.stringify(replay));
	fd.set("score", String(meta.score));
	fd.set("clips", String(meta.clips));
	fd.set("grade", meta.grade);
	fd.set("roast", meta.roast);
	if (blob && mime) {
		const ext = mime.includes("mp4") ? "mp4" : mime.includes("jpeg") ? "jpg" : "webm";
		fd.set("tape", blob, `take.${ext}`);
	}
	const res = await fetch("/api/tape", {
		method: "POST",
		body: fd,
		headers: authHeaders(),
		credentials: "include"
	});
	if (res.status === 401) throw new Error("Unauthorized");
	if (!res.ok) throw new Error("save failed");
	const json = await res.json();
	await clearPendingTape();
	return json.id;
}
async function fetchReplay(id) {
	const res = await fetch(`/api/tape/${id}`, {
		headers: authHeaders(),
		credentials: "include"
	});
	if (!res.ok) throw new Error("missing tape");
	const json = await res.json();
	if (!json.replay?.keys?.length) throw new Error("empty tape");
	return json.replay;
}
async function keepTapeLocal(meta, replay, blob, mime) {
	await stashPendingTape({
		...meta,
		replay,
		blob: blob ?? new Blob(),
		mime: mime ?? "",
		at: Date.now()
	});
}
function startTake() {
	abortTape();
	resetSim();
	resetHud();
	tapeAudio.unlock();
	tapeAudio.recBeep();
	tapeAudio.startCrowd();
	lockPointer();
}
function returnToMenu() {
	resetSim();
	tapeAudio.stopCrowd();
	useTape.setState({
		phase: "menu",
		results: null,
		score: 0,
		clips: 0,
		viral: 0,
		takeTime: 0,
		note: "Keep them in frame. You won't.",
		missing: false,
		sirens: false,
		flash: "",
		caption: "",
		event: "none"
	});
}
function watchTape(from = "results") {
	const tape = lastReplay();
	if (!tape || tape.keys.length < 2) return;
	setReplay(tape);
	tapeAudio.unlock();
	tapeAudio.startCrowd();
	useTape.setState({
		phase: "replay",
		replayFrom: from,
		takeTime: 0,
		takeLen: tape.len,
		event: "none",
		missing: false,
		flash: "",
		caption: "",
		note: "This is what you shot."
	});
}
function playSavedTape(data) {
	setReplay(data);
	watchTape("menu");
}
function stopPlayback() {
	const from = useTape.getState().replayFrom ?? "results";
	if (from === "menu") tapeAudio.stopCrowd();
	useTape.setState({
		phase: from,
		event: "none"
	});
}
function stickFromEvent(el, e) {
	const r = el.getBoundingClientRect();
	const cx = r.left + r.width / 2;
	const cy = r.top + r.height / 2;
	let x = (e.clientX - cx) / (r.width * .5);
	let y = (e.clientY - cy) / (r.height * .5);
	const m = Math.hypot(x, y);
	if (m > 1) {
		x /= m;
		y /= m;
	}
	input.joyX = x;
	input.joyY = y;
}
function TouchPad() {
	const lookLast = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 md:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0",
				onPointerDown: (e) => {
					if (e.target.closest("[data-touch-ui]")) return;
					lookLast.current = {
						x: e.clientX,
						y: e.clientY
					};
					e.currentTarget.setPointerCapture(e.pointerId);
				},
				onPointerMove: (e) => {
					if (!lookLast.current) return;
					input.lookX += e.clientX - lookLast.current.x;
					input.lookY += e.clientY - lookLast.current.y;
					lookLast.current = {
						x: e.clientX,
						y: e.clientY
					};
				},
				onPointerUp: () => {
					lookLast.current = null;
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-touch-ui": true,
				className: "pointer-events-auto absolute bottom-6 left-4 size-28 rounded-full border border-border bg-surface/70",
				onPointerDown: (e) => {
					e.stopPropagation();
					e.currentTarget.setPointerCapture(e.pointerId);
					stickFromEvent(e.currentTarget, e);
				},
				onPointerMove: (e) => {
					if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
					stickFromEvent(e.currentTarget, e);
				},
				onPointerUp: (e) => {
					e.stopPropagation();
					input.joyX = 0;
					input.joyY = 0;
				},
				onPointerCancel: () => {
					input.joyX = 0;
					input.joyY = 0;
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[42%] rounded-full bg-fg/70" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-touch-ui": true,
				className: "pointer-events-auto absolute right-4 bottom-6 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 w-12 rounded-lg border border-border bg-surface/80 font-display text-lg text-fg",
						onPointerDown: (e) => {
							e.stopPropagation();
							input.zoomDelta += .4;
						},
						children: "+"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 w-12 rounded-lg border border-border bg-surface/80 font-display text-lg text-fg",
						onPointerDown: (e) => {
							e.stopPropagation();
							input.zoomDelta -= .4;
						},
						children: "−"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 w-12 rounded-lg bg-rec font-display text-[10px] tracking-wide text-fg",
						onPointerDown: (e) => {
							e.stopPropagation();
							input.panicQueued = true;
						},
						children: "OI"
					})
				]
			})
		]
	});
}
function formatTime(t) {
	const s = Math.max(0, Math.floor(t));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function AuthChip() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-24 animate-pulse rounded-full bg-elevated" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "rounded-md border border-border bg-surface/80 px-3 py-2 text-sm text-fg",
		children: "Sign in"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-md border border-border bg-surface/80 px-2 py-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	});
}
function TapeMedia({ url, mime, className }) {
	if (mime.startsWith("image/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "Your tape",
		className
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src: url,
		className,
		controls: true,
		playsInline: true,
		autoPlay: true,
		muted: true,
		loop: true
	});
}
function Menu() {
	const { user } = useCurrentUserState();
	const [takes, setTakes] = (0, import_react.useState)([]);
	const [best, setBest] = (0, import_react.useState)(0);
	const [watchBusy, setWatchBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setBest(Number(localStorage.getItem("bad-angle-best") || "0"));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let live = true;
		(async () => {
			const pending = await readPendingTape();
			if (pending?.replay?.keys?.length) try {
				await uploadTape({
					score: pending.score,
					clips: pending.clips,
					grade: pending.grade,
					roast: pending.roast
				}, pending.replay ?? {
					keys: [],
					len: 0
				}, pending.blob.size > 100 ? pending.blob : null, pending.mime);
			} catch {}
			try {
				const rows = await listTakes();
				if (live) setTakes(rows);
			} catch {
				if (live) setTakes([]);
			}
		})();
		return () => {
			live = false;
		};
	}, [user]);
	async function playSaved(id) {
		setWatchBusy(true);
		try {
			playSavedTape(await fetchReplay(id));
		} catch {} finally {
			setWatchBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
					children: "Outside The Blind Spot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 font-mono text-xs tracking-[0.22em] text-muted uppercase",
						children: "Fight filmer simulator"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-6xl leading-[0.9] font-bold tracking-tight text-fg sm:text-8xl",
						children: [
							"BAD",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"ANGLE"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-sm text-base text-muted",
						children: "You are the cameraman. You are not good at this. Keep the scrap in frame, try not to film the tarmac, and whatever you do — don't get excited."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto mt-7 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: () => startTake(),
							children: "Start the take"
						}), best > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted",
							children: ["Best ", best.toLocaleString()]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] text-subtle uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "WASD / stick" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Move" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Mouse / drag" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Aim the phone" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Shift" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Run (worse)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Scroll / Q E" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Zoom hunt" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Space / OI" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Shout" })
						]
					}),
					takes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto mt-6 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 font-mono text-[11px] tracking-widest text-subtle uppercase",
							children: "Saved tapes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1 text-sm text-muted",
							children: takes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									t.grade,
									" · ",
									t.score.toLocaleString()
								] }), t.hasTape ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex h-9 items-center gap-1 rounded-sm px-2 text-fg hover:bg-elevated",
									onClick: () => void playSaved(t.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Play"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: "No tape"
								})]
							}, t.id))
						})]
					}) : null
				]
			}),
			watchBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-auto font-mono text-[11px] tracking-widest text-muted uppercase",
				children: "Loading tape…"
			}) : null
		]
	});
}
function Hud() {
	const takeTime = useTape((s) => s.takeTime);
	const takeLen = useTape((s) => s.takeLen);
	const viral = useTape((s) => s.viral);
	const clips = useTape((s) => s.clips);
	const zoom = useTape((s) => s.zoom);
	const battery = useTape((s) => s.battery);
	const note = useTape((s) => s.note);
	const event = useTape((s) => s.event);
	const flash = useTape((s) => s.flash);
	const caption = useTape((s) => s.caption);
	const missing = useTape((s) => s.missing);
	const inFrame = useTape((s) => s.inFrame);
	const left = Math.max(0, takeLen - takeTime);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-3 rounded-[28px] border border-fg/20 shadow-[inset_0_0_56px_rgba(0,0,0,0.28)] sm:inset-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-6 right-6 left-6 flex items-start justify-between font-mono text-[11px] tracking-widest text-fg sm:top-8 sm:right-8 sm:left-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-rec" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["REC ", formatTime(takeTime)] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [zoom.toFixed(1), "×"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn(battery < 8 && "text-rec"),
						children: [Math.round(battery), "%"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/2 right-6 h-32 w-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-fg/15 sm:right-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-0 bottom-0 left-0 bg-fg",
					style: { height: `${Math.round(viral)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-10 bottom-24 left-10 text-center sm:bottom-28",
				children: [flash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-5xl font-bold tracking-tight text-fg sm:text-7xl",
					children: flash
				}) : null, caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl tracking-wide text-fg",
					children: caption
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-8 bottom-8 left-8 flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-fg/90",
					children: note
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[11px] tracking-widest text-muted uppercase",
					children: [
						inFrame,
						"/2 in frame · ",
						clips,
						" clips · ",
						formatTime(left),
						" left"
					]
				})]
			}),
			event === "finger" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-10%] left-[-8%] h-[70%] w-[55%] rounded-full bg-bg/85 blur-md" }) : null,
			event === "flash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-fg/80" }) : null,
			missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0 grid place-items-center bg-bg/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => lockPointer(),
					className: "rounded-lg border border-border bg-surface px-6 py-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Click to keep filming"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "You're missing it."
					})]
				})
			}) : null
		]
	});
}
function Results() {
	const results = useTape((s) => s.results);
	const tapeUrl = useTape((s) => s.tapeUrl);
	const tapeMime = useTape((s) => s.tapeMime);
	const tapeRoll = useTape((s) => s.tapeRoll);
	const tapeSaved = useTape((s) => s.tapeSaved);
	const tapeSaving = useTape((s) => s.tapeSaving);
	const { user } = useCurrentUserState();
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!results) return;
		try {
			const best = Number(localStorage.getItem("bad-angle-best") || "0");
			if (results.score > best) localStorage.setItem("bad-angle-best", String(results.score));
		} catch {}
	}, [results]);
	(0, import_react.useEffect)(() => {
		if (!results || tapeRoll !== "ready" && tapeRoll !== "replay") return;
		const replay = lastReplay();
		if (!replay?.keys.length) return;
		const tape = lastTape();
		keepTapeLocal({
			score: results.score,
			clips: results.clips,
			grade: results.grade,
			roast: results.roast
		}, replay, tape?.blob, tape?.mime);
	}, [results, tapeRoll]);
	(0, import_react.useEffect)(() => {
		if (!results || !user || saved) return;
		if (tapeRoll === "recording" || tapeRoll === "idle") return;
		const replay = lastReplay();
		if (!replay?.keys.length) return;
		setSaved(true);
		const tape = lastTape();
		const meta = {
			score: results.score,
			clips: results.clips,
			grade: results.grade,
			roast: results.roast
		};
		useTape.setState({ tapeSaving: true });
		uploadTape(meta, replay, tape?.blob, tape?.mime).then((id) => {
			useTape.setState({
				tapeSaved: true,
				tapeSaving: false,
				tapeId: id
			});
		}).catch(() => {
			useTape.setState({ tapeSaving: false });
			saveTake({ data: meta }).catch(() => {});
		});
	}, [
		results,
		user,
		saved,
		tapeRoll
	]);
	if (!results) return null;
	const ext = tapeMime.includes("mp4") ? "mp4" : tapeMime.includes("jpeg") ? "jpg" : "webm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 overflow-y-auto bg-bg/55 p-5 sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-full items-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg rounded-xl border border-border bg-surface/95 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.2em] text-muted uppercase",
						children: "Take in the can"
					}),
					tapeRoll === "ready" && tapeUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-hidden rounded-lg border border-border bg-bg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeMedia, {
							url: tapeUrl,
							mime: tapeMime,
							className: "aspect-video w-full object-cover"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: tapeRoll === "failed" ? "Couldn't roll a file. The take is still on the camera." : tapeRoll === "recording" ? "Developing tape…" : "Your awful camerawork is in the can. Watch it back."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-7xl leading-none font-bold",
							children: results.grade
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl tabular-nums",
							children: results.score.toLocaleString()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: results.roast
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid grid-cols-2 gap-2 font-mono text-[11px] text-subtle uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"On subject ",
								results.subjectPct,
								"%"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Clips ", results.clips] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"Pavement ",
								results.feet,
								"s"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"Sky ",
								results.sky,
								"s"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Got hit ", results.hitsTaken] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"Finger ",
								results.fingers,
								"×"
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => startTake(),
								children: "Another take"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => watchTape("results"),
								children: "Watch tape"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => returnToMenu(),
								children: "Back"
							}),
							tapeUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: tapeUrl,
									download: `bad-angle-${results.grade}.${ext}`,
									children: "Download"
								})
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-fg underline-offset-4 hover:underline",
							children: "Sign in to keep this tape on your account"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: tapeSaving ? "Saving tape to your account…" : tapeSaved ? "Tape saved to your account." : "Saving…" })]
					})
				]
			})
		})
	});
}
function Overlay() {
	const phase = useTape((s) => s.phase);
	const [touch, setTouch] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTouch(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 700);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		phase === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {}) : null,
		phase === "playing" || phase === "replay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}) : null,
		phase === "playing" && touch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchPad, {}) : null,
		phase === "replay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto absolute right-5 bottom-5 sm:right-8 sm:bottom-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => stopPlayback(),
				children: "Stop playback"
			})
		}) : null,
		phase === "results" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Results, {}) : null
	] });
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var scenePromise = typeof window !== "undefined" ? import("./FightScene-BDK88w74.mjs") : null;
function Home() {
	const [Scene, setScene] = (0, import_react.useState)(null);
	const event = useTape((s) => s.event);
	(0, import_react.useEffect)(() => {
		let live = true;
		(scenePromise ?? import("./FightScene-BDK88w74.mjs")).then((m) => {
			if (live) setScene(() => m.FightScene);
		});
		return () => {
			live = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("absolute inset-0", event === "focus" && "blur-[6px]"),
			children: Scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-full place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tracking-tight",
					children: "LOADING TAPE"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
//#endregion
export { LAMPS as A, input as C, BOLLARDS as D, BIN as E, CARS as O, held as S, setLockTarget as T, attachInput as _, finishTape as a, consumeZoom as b, replayNow as c, tapeAudio as d, attachControlsTest as f, tickSim as g, summarize as h, beginTape as i, PUB as j, CROWD as k, stampTape as l, sim as m, advanceReplay as n, keyAt as o, scoreFrame as p, applyKeyToSim as r, lastReplay as s, routes_exports as t, useTape as u, consumeLook as v, lockPointer as w, detachInput as x, consumePanic as y };
