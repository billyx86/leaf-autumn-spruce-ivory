import { forwardRef } from "react";
import * as THREE from "three";
import type { Geos, Mats } from "./textures";

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
