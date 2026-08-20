export type Aabb = { x0: number; x1: number; z0: number; z1: number };

export const FIGHT = { x: 0, z: 0 };
export const SPAWN = { x: 5.2, z: 8.4 };
export const TAKE_LEN = 68;

export const PUB = { x: -12, z: 0, w: 8, d: 12, h: 5.2 };

export type CarDef = {
  x: number;
  z: number;
  rot: number;
  w: number;
  l: number;
  color: string;
  cabin: string;
  kind: "van" | "car";
};

export const CARS: CarDef[] = [
  { x: 8.6, z: -2.4, rot: 0.18, w: 1.7, l: 4.2, color: "#cfd3d8", cabin: "#8b949e", kind: "van" },
  { x: 9.4, z: 3.6, rot: -0.42, w: 1.55, l: 3.5, color: "#1a1d22", cabin: "#0c0e12", kind: "car" },
  { x: -3.4, z: 10.6, rot: 1.48, w: 1.6, l: 3.8, color: "#3a322e", cabin: "#1d1816", kind: "car" },
];

export const LAMPS = [
  { x: -6.2, z: 7.4 },
  { x: 5.6, z: 6.8 },
  { x: -5.4, z: -7.2 },
];

export const BIN = { x: 3.6, z: -7.1 };

export const BOLLARDS = [
  { x: -7.6, z: 5.4 },
  { x: -7.6, z: 3.6 },
  { x: -7.6, z: -3.6 },
  { x: -7.6, z: -5.4 },
];

function carAabb(c: CarDef): Aabb {
  const pad = 0.28;
  const hw =
    (Math.abs(Math.cos(c.rot)) * c.w + Math.abs(Math.sin(c.rot)) * c.l) / 2 + pad;
  const hd =
    (Math.abs(Math.sin(c.rot)) * c.w + Math.abs(Math.cos(c.rot)) * c.l) / 2 + pad;
  return { x0: c.x - hw, x1: c.x + hw, z0: c.z - hd, z1: c.z + hd };
}

export const BOXES: Aabb[] = [
  { x0: -16.2, x1: -7.85, z0: -6.2, z1: 6.2 },
  { x0: -16.5, x1: 16.5, z0: -15.6, z1: -14.55 },
  { x0: -17.5, x1: -16.15, z0: -15.5, z1: 12.5 },
  { x0: 3.05, x1: 4.2, z0: -7.65, z1: -6.55 },
  ...CARS.map(carAabb),
];

export const CROWD = Array.from({ length: 8 }, (_, i) => {
  const ang = (i / 8) * Math.PI * 2 + 0.31;
  const r = 4.55 + (i % 3) * 0.28;
  return {
    ang,
    r,
    x: Math.cos(ang) * r,
    z: Math.sin(ang) * r,
    phone: i % 2 === 0,
    scale: 0.94 + (i % 3) * 0.05,
    shirt: i % 4,
  };
});
