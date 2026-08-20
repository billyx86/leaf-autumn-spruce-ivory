import { BIN, BOLLARDS, CARS, LAMPS, PUB } from "./layout";
import type { Mats } from "./textures";

export function World({ mats, sirens }: { mats: Mats; sirens: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.asphalt}>
        <planeGeometry args={[42, 42]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 13.6]}
        material={mats.road}
      >
        <planeGeometry args={[42, 8]} />
      </mesh>
      <mesh position={[0, 0.06, 9.55]} material={mats.brick}>
        <boxGeometry args={[42, 0.12, 0.55]} />
      </mesh>

      <group position={[PUB.x, 0, PUB.z]}>
        <mesh position={[0, PUB.h / 2, 0]} material={mats.brick}>
          <boxGeometry args={[PUB.w, PUB.h, PUB.d]} />
        </mesh>
        {[-3.6, -1.2, 1.2, 3.6].map((z) => (
          <mesh key={z} position={[PUB.w / 2 - 0.04, 2.45, z]} material={mats.windows}>
            <boxGeometry args={[0.1, 1.55, 1.35]} />
          </mesh>
        ))}
        <mesh position={[PUB.w / 2 + 0.04, 1.15, 0]} material={mats.dark}>
          <boxGeometry args={[0.12, 2.3, 1.2]} />
        </mesh>
        <mesh
          position={[PUB.w / 2 + 0.07, 4.55, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={mats.sign}
        >
          <planeGeometry args={[3.6, 0.9]} />
        </mesh>
      </group>

      <mesh position={[0, 1.8, -15.1]} material={mats.brick}>
        <boxGeometry args={[34, 3.6, 0.55]} />
      </mesh>
      <mesh position={[-16.8, 2.2, -1]} material={mats.brick}>
        <boxGeometry args={[0.55, 4.4, 28]} />
      </mesh>

      {CARS.map((c) => (
        <group key={`${c.x}-${c.z}`} position={[c.x, 0, c.z]} rotation={[0, c.rot, 0]}>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.shadow}>
            <circleGeometry args={[1.3, 10]} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[c.w, 0.58, c.l]} />
            <meshStandardMaterial color={c.color} roughness={0.38} metalness={0.42} />
          </mesh>
          <mesh position={[0, 0.92, -c.l * 0.08]}>
            <boxGeometry args={[c.w * 0.88, 0.42, c.l * 0.48]} />
            <meshStandardMaterial color={c.cabin} roughness={0.25} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {LAMPS.map((l) => (
        <group key={`${l.x}-${l.z}`} position={[l.x, 0, l.z]}>
          <mesh position={[0, 2.2, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.055, 0.08, 4.4, 6]} />
          </mesh>
          <mesh position={[0, 4.45, 0]} material={mats.glow}>
            <sphereGeometry args={[0.15, 8, 8]} />
          </mesh>
          <pointLight
            color="#ffc890"
            intensity={55}
            distance={20}
            position={[0, 4.25, 0]}
            decay={1.4}
          />
        </group>
      ))}

      <mesh position={[BIN.x, 0.55, BIN.z]} material={mats.bin}>
        <boxGeometry args={[0.85, 1.1, 0.85]} />
      </mesh>
      {BOLLARDS.map((b) => (
        <mesh key={`${b.x}-${b.z}`} position={[b.x, 0.38, b.z]} material={mats.metal}>
          <cylinderGeometry args={[0.09, 0.1, 0.76, 8]} />
        </mesh>
      ))}

      <mesh position={[-10, 8, -28]} material={mats.windows}>
        <boxGeometry args={[18, 16, 2]} />
      </mesh>
      <mesh position={[14, 7, -32]} material={mats.windows}>
        <boxGeometry args={[16, 14, 2]} />
      </mesh>
      <mesh position={[26, 6, 2]} material={mats.windows}>
        <boxGeometry args={[2, 12, 18]} />
      </mesh>

      {sirens ? (
        <group position={[-2.2, 0, 14.5]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.8, 0.7, 4.4]} />
            <meshStandardMaterial color="#1c242c" roughness={0.45} metalness={0.35} />
          </mesh>
          <mesh position={[-0.35, 1.05, 0.2]} material={mats.copR}>
            <boxGeometry args={[0.3, 0.16, 0.5]} />
          </mesh>
          <mesh position={[0.35, 1.05, 0.2]} material={mats.copB}>
            <boxGeometry args={[0.3, 0.16, 0.5]} />
          </mesh>
          <pointLight color="#c4453c" intensity={10} distance={10} position={[-0.4, 1.2, 0]} />
          <pointLight color="#3a6aa8" intensity={10} distance={10} position={[0.4, 1.2, 0]} />
        </group>
      ) : null}
    </group>
  );
}
