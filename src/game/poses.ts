import * as THREE from "three";
import type { Fighter } from "./sim";

type Bones = {
  body: THREE.Object3D;
  armL: THREE.Object3D;
  armR: THREE.Object3D;
  legL: THREE.Object3D;
  legR: THREE.Object3D;
};

/**
 * Per-frame pose appliers for the fighters and the crowd. These are pure
 * Three.js object manipulation (no React), so they live in a module separate
 * from the `Person` component — keeping `people.tsx` component-only preserves
 * fast refresh for it (react-refresh/only-export-components).
 */
export function applyFighterPose(group: THREE.Group, f: Fighter) {
  group.position.set(f.x, 0, f.z);
  group.rotation.y = f.yaw;
  const bones = group.userData.bones as Bones | undefined;
  if (!bones?.body) return;
  bones.body.rotation.z = f.downAmt * 1.32;
  bones.body.rotation.x = f.downAmt * 0.28 + (f.state === "hit" ? -0.18 : 0);
  bones.body.position.y = 0.92 - f.downAmt * 0.72;
  const walk = f.state === "down" || f.state === "getup" ? 0 : Math.sin(f.walk);
  bones.armR.rotation.x = -f.punch * 1.72;
  bones.armL.rotation.x =
    f.state === "hit" ? -0.85 : walk * 0.42 * (1 - f.downAmt);
  bones.legL.rotation.x = walk * 0.55 * (1 - f.downAmt);
  bones.legR.rotation.x = -walk * 0.55 * (1 - f.downAmt);
}

export function applyCrowdPose(
  group: THREE.Group,
  t: number,
  i: number,
  recoil: number,
  base: { x: number; z: number; ang: number; r: number; phone: boolean },
) {
  const r = base.r + recoil * 0.45;
  const x = Math.cos(base.ang) * r;
  const z = Math.sin(base.ang) * r;
  group.position.set(x, 0, z);
  group.rotation.y = Math.atan2(-x, -z);
  const bones = group.userData.bones as Bones | undefined;
  if (!bones?.armR) return;
  bones.armR.rotation.x = base.phone ? -1.35 : Math.sin(t * 1.4 + i) * 0.12;
  bones.armL.rotation.x = Math.sin(t * 1.4 + i + 1) * 0.12;
  bones.body.rotation.y = Math.sin(t * 0.7 + i) * 0.08;
}
