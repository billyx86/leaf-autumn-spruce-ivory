import { forwardRef } from "react";
import * as THREE from "three";
import type { Geos, Mats } from "./textures";
import type { Fighter } from "./sim";

type PersonProps = {
  mats: Mats;
  geos: Geos;
  shirt: THREE.Material;
  skin: THREE.Material;
  hasPhone?: boolean;
  scale?: number;
};

function bindBones(el: THREE.Group | null) {
  if (!el) return;
  el.userData.bones = {
    body: el.getObjectByName("body"),
    armL: el.getObjectByName("armL"),
    armR: el.getObjectByName("armR"),
    legL: el.getObjectByName("legL"),
    legR: el.getObjectByName("legR"),
  };
}

export const Person = forwardRef<THREE.Group, PersonProps>(function Person(
  { mats, geos, shirt, skin, hasPhone = false, scale = 1 },
  ref,
) {
  return (
    <group
      ref={(el) => {
        bindBones(el);
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      scale={scale}
    >
      <mesh
        name="shadow"
        geometry={geos.shadow}
        material={mats.shadow}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      />
      <group name="body" position={[0, 0.92, 0]}>
        <mesh geometry={geos.torso} material={shirt} />
        <mesh geometry={geos.head} material={skin} position={[0, 0.4, 0]} />
        <mesh
          geometry={geos.hair}
          material={mats.hair}
          position={[0, 0.46, -0.01]}
          scale={[1.02, 0.55, 1.05]}
        />
        <group name="armL" position={[-0.24, 0.18, 0]}>
          <mesh geometry={geos.arm} material={shirt} position={[0, -0.2, 0]} />
        </group>
        <group name="armR" position={[0.24, 0.18, 0]}>
          <mesh geometry={geos.arm} material={shirt} position={[0, -0.2, 0]} />
          {hasPhone ? (
            <group position={[0, -0.42, 0.08]} rotation={[-1.15, 0, 0]}>
              <mesh geometry={geos.phone} material={mats.phone} />
              <mesh
                geometry={geos.phone}
                material={mats.screen}
                position={[0, 0, 0.012]}
                scale={[0.78, 0.78, 0.2]}
              />
            </group>
          ) : null}
        </group>
        <group name="legL" position={[-0.1, -0.26, 0]}>
          <mesh geometry={geos.leg} material={mats.jeans} position={[0, -0.28, 0]} />
          <mesh geometry={geos.foot} material={mats.shoe} position={[0, -0.56, 0.04]} />
        </group>
        <group name="legR" position={[0.1, -0.26, 0]}>
          <mesh geometry={geos.leg} material={mats.jeans} position={[0, -0.28, 0]} />
          <mesh geometry={geos.foot} material={mats.shoe} position={[0, -0.56, 0.04]} />
        </group>
      </group>
    </group>
  );
});

type Bones = {
  body: THREE.Object3D;
  armL: THREE.Object3D;
  armR: THREE.Object3D;
  legL: THREE.Object3D;
  legR: THREE.Object3D;
};

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
