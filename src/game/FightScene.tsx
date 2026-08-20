"use client";

import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CROWD, TAKE_LEN } from "./layout";
import { World } from "./world";
import { Person, applyCrowdPose, applyFighterPose } from "./people";
import { createGeos, createMaterials } from "./textures";
import {
  attachControlsTest,
  scoreFrame,
  sim,
  summarize,
  tickSim,
} from "./sim";
import {
  attachInput,
  consumeLook,
  consumePanic,
  consumeZoom,
  detachInput,
  held,
  input,
  lockPointer,
  setLockTarget,
} from "./input";
import { tapeAudio } from "./audio";
import { useTape, type TapePhase } from "./store";
import { beginTape, finishTape, stampTape, lastReplay, keyAt, applyKeyToSim, advanceReplay, replayNow } from "./recorder";

const visV = new THREE.Vector3();

function Loop({
  f0,
  f1,
  crowd,
  sparks,
}: {
  f0: RefObject<THREE.Group | null>;
  f1: RefObject<THREE.Group | null>;
  crowd: MutableRefObject<(THREE.Group | null)[]>;
  sparks: MutableRefObject<(THREE.Mesh | null)[]>;
}) {
  const sparkPool = useRef(
    Array.from({ length: 16 }, () => ({
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
    })),
  );
  const hudAcc = useRef(0);
  const sirenOnce = useRef(false);
  const lastHit = useRef(false);
  const shoveOnce = useRef(false);
  const shoutOnce = useRef(false);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.08);
    const phase = useTape.getState().phase;
    const playing = phase === "playing";
    const replaying = phase === "replay";

    if (replaying) {
      sim.animTime += dt;
      const tape = lastReplay();
      const t = advanceReplay(dt);
      if (!tape || t >= Math.max(tape.len, 0.2)) {
        const back = useTape.getState().replayFrom ?? "results";
        if (back === "menu") tapeAudio.stopCrowd();
        useTape.setState({ phase: back, event: "none" });
      } else {
        const k = keyAt(tape, t);
        if (k) applyKeyToSim(k);
      }
    } else {
      let moveF = 0;
      let moveR = 0;
      if (held("KeyW") || held("ArrowUp")) moveF += 1;
      if (held("KeyS") || held("ArrowDown")) moveF -= 1;
      if (held("KeyD") || held("ArrowRight")) moveR += 1;
      if (held("KeyA") || held("ArrowLeft")) moveR -= 1;
      moveF += -input.joyY;
      moveR += input.joyX;
      if (held("KeyQ")) input.zoomDelta += dt * 1.4;
      if (held("KeyE")) input.zoomDelta -= dt * 1.4;

      const look = consumeLook();
      const zoom = consumeZoom();
      const panic = consumePanic();

      tickSim(dt, {
        moveF,
        moveR,
        lookX: look.x,
        lookY: look.y,
        zoomDelta: zoom,
        sprint: held("ShiftLeft") || held("ShiftRight"),
        panic,
        playing,
      });
    }

    const cam = camera as THREE.PerspectiveCamera;
    cam.rotation.order = "YXZ";
    if (playing || replaying) {
      const n1 =
        Math.sin(sim.animTime * 23.1) * 0.4 + Math.sin(sim.animTime * 51.7) * 0.25;
      const n2 =
        Math.sin(sim.animTime * 19.4 + 1) * 0.4 + Math.sin(sim.animTime * 44.2) * 0.2;
      const n3 =
        Math.sin(sim.animTime * 11.2) * 0.45 + Math.sin(sim.animTime * 31.8) * 0.2;
      const amp =
        (0.012 + sim.panic * 0.05) *
        (sim.sprint ? 2.1 : 1) *
        (sim.event === "trip" || sim.event === "shove" ? 2.2 : 1);
      cam.position.set(sim.px, sim.eye, sim.pz);
      cam.rotation.y = sim.yaw + n1 * amp * 6;
      cam.rotation.x = sim.pitch + n2 * amp * 6;
      cam.rotation.z = sim.roll + n3 * amp * 3;
      const fov = THREE.MathUtils.lerp(70, 24, (sim.zoom - 1) / 2.8);
      if (Math.abs(cam.fov - fov) > 0.04) {
        cam.fov = fov;
        cam.updateProjectionMatrix();
      }
    } else {
      const t = sim.animTime;
      const a = t * 0.16;
      cam.position.set(Math.sin(a) * 7.6 + 3.2, 2.85, Math.cos(a) * 6.8 + 4.4);
      cam.lookAt(0, 1.05, 0);
      if (Math.abs(cam.fov - 48) > 0.1) {
        cam.fov = 48;
        cam.updateProjectionMatrix();
      }
    }

    if (playing) {
      const vis = (x: number, y: number, z: number) => {
        visV.set(x, y, z).project(camera);
        return (
          visV.z > -1 &&
          visV.z < 1 &&
          Math.abs(visV.x) < 0.72 &&
          Math.abs(visV.y) < 0.78
        );
      };
      scoreFrame(vis, dt);
    }

    if (f0.current) applyFighterPose(f0.current, sim.f[0]);
    if (f1.current) applyFighterPose(f1.current, sim.f[1]);
    crowd.current.forEach((g, i) => {
      if (!g) return;
      const c = CROWD[i];
      if (!c) return;
      applyCrowdPose(g, sim.animTime, i, sim.crowdRecoil, c);
    });

    const pool = sparkPool.current;
    if (sim.pendingHit && !lastHit.current) {
      lastHit.current = true;
      tapeAudio.punch(sim.pendingHit.heavy);
      tapeAudio.setCrowdHeat(sim.pendingHit.heavy ? 0.95 : 0.55);
      for (let i = 0; i < 8; i += 1) {
        const p = pool[i]!;
        p.x = sim.pendingHit.x;
        p.y = 1.3;
        p.z = sim.pendingHit.z;
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = 2 + Math.random() * 3;
        p.vz = (Math.random() - 0.5) * 4;
        p.life = 0.35 + Math.random() * 0.2;
      }
    }
    if (!sim.pendingHit) lastHit.current = false;

    if (sim.event === "shove") {
      if (!shoveOnce.current) {
        shoveOnce.current = true;
        tapeAudio.shove();
      }
    } else shoveOnce.current = false;

    if (sim.event === "commentary") {
      if (!shoutOnce.current) {
        shoutOnce.current = true;
        tapeAudio.whoa();
      }
    } else shoutOnce.current = false;

    if (!sim.sirens) sirenOnce.current = false;
    if (sim.sirens && !sirenOnce.current && playing) {
      sirenOnce.current = true;
      tapeAudio.siren();
    }

    for (let i = 0; i < pool.length; i += 1) {
      const p = pool[i]!;
      const mesh = sparks.current[i];
      if (p.life > 0) {
        p.life -= dt;
        p.vy -= 9 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        if (mesh) {
          mesh.visible = true;
          mesh.position.set(p.x, p.y, p.z);
        }
      } else if (mesh) mesh.visible = false;
    }

    if (sim.wantEnd && phase === "playing") {
      const results = summarize(sim);
      sim.ended = true;
      tapeAudio.stopCrowd();
      useTape.setState({
        phase: "results",
        results,
        score: results.score,
        clips: results.clips,
        note: results.roast,
        missing: false,
        sirens: true,
      });
      if (typeof document !== "undefined" && document.exitPointerLock) {
        document.exitPointerLock();
      }
    }

    hudAcc.current += dt;
    if (hudAcc.current > 0.09 || sim.flashT > 0) {
      hudAcc.current = 0;
      useTape.setState({
        takeTime: replaying ? replayNow() : sim.takeTime,
        takeLen: replaying ? lastReplay()?.len ?? TAKE_LEN : TAKE_LEN,
        score: Math.round(sim.score),
        viral: sim.viral,
        clips: sim.clips,
        zoom: sim.zoom,
        battery: sim.battery,
        note: sim.note,
        event: sim.event,
        flash: sim.flash,
        caption: sim.caption,
        inFrame: sim.inFrame,
        missing: playing && !input.isTouch && !input.pointerLocked,
        sirens: sim.sirens,
      });
    }
  });

  return null;
}

function CaptureCanvas() {
  const { gl } = useThree();
  const phase = useTape((s) => s.phase);
  const last = useRef<TapePhase | "">("");

  useEffect(() => {
    setLockTarget(gl.domElement);
    gl.domElement.style.touchAction = "none";
    return () => setLockTarget(null);
  }, [gl]);

  useEffect(() => {
    if (phase === "playing" && last.current !== "playing") {
      beginTape(gl.domElement);
    }
    if (phase === "results" && last.current === "playing") {
      void finishTape().then((tape) => {
        const replay = lastReplay();
        const prev = useTape.getState().tapeUrl;
        if (prev) URL.revokeObjectURL(prev);
        if (tape) {
          useTape.setState({
            tapeUrl: URL.createObjectURL(tape.blob),
            tapeMime: tape.mime,
            tapeRoll: "ready",
          });
        } else if (replay && replay.keys.length > 2) {
          useTape.setState({ tapeUrl: null, tapeMime: "", tapeRoll: "replay" });
        } else {
          useTape.setState({ tapeRoll: "failed" });
        }
      });
    }
    last.current = phase;
  }, [phase]);

  useFrame(() => {
    const s = useTape.getState();
    if (s.phase === "playing") {
      stampTape(gl.domElement, {
        takeTime: s.takeTime,
        event: s.event,
        battery: s.battery,
      });
    }
  }, 1);

  return null;
}

export function FightScene() {
  const mats = useMemo(() => createMaterials(), []);
  const geos = useMemo(() => createGeos(), []);
  const f0 = useRef<THREE.Group>(null);
  const f1 = useRef<THREE.Group>(null);
  const crowd = useRef<(THREE.Group | null)[]>([]);
  const sparks = useRef<(THREE.Mesh | null)[]>([]);
  const sirens = useTape((s) => s.sirens || s.phase === "results");

  useEffect(() => {
    attachInput();
    attachControlsTest();
    return () => {
      detachInput();
      mats.dispose();
      geos.dispose();
    };
  }, [mats, geos]);

  return (
    <Canvas
      camera={{ fov: 50, near: 0.08, far: 90, position: [8, 2.6, 8] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#2a241c");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.55;
        scene.fog = new THREE.FogExp2("#2c261e", 0.016);
        setLockTarget(gl.domElement);
      }}
      onPointerDown={() => {
        if (useTape.getState().phase === "playing") lockPointer();
      }}
      style={{ touchAction: "none", height: "100%", width: "100%" }}
    >
      <hemisphereLight color="#8a97a8" groundColor="#4a3c2e" intensity={1.05} />
      <ambientLight intensity={0.48} />
      <directionalLight
        color="#ffd2a8"
        intensity={1.35}
        position={[8, 12, 6]}
      />
      <pointLight color="#ffc896" intensity={36} distance={16} decay={1.4} position={[0, 5.2, 0]} />
      <World mats={mats} sirens={sirens} />
      <Person ref={f0} mats={mats} geos={geos} shirt={mats.red} skin={mats.skin} />
      <Person ref={f1} mats={mats} geos={geos} shirt={mats.navy} skin={mats.skin2} />
      {CROWD.map((c, i) => (
        <Person
          key={i}
          ref={(el) => {
            crowd.current[i] = el;
          }}
          mats={mats}
          geos={geos}
          shirt={mats.crowd[c.shirt] ?? mats.dark}
          skin={i % 2 ? mats.skin : mats.skin2}
          hasPhone={c.phone}
          scale={c.scale}
        />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            sparks.current[i] = el;
          }}
          visible={false}
          material={mats.spark}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
        </mesh>
      ))}
      <Loop f0={f0} f1={f1} crowd={crowd} sparks={sparks} />
      <CaptureCanvas />
    </Canvas>
  );
}
