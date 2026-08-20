import * as THREE from "three";

function canvasTex(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeat = 1,
) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function asphalt(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#4a4744";
  ctx.fillRect(0, 0, n, n);
  for (let i = 0; i < 2400; i += 1) {
    const x = Math.random() * n;
    const y = Math.random() * n;
    const v = 72 + Math.random() * 48;
    ctx.fillStyle = `rgb(${v},${v - 2},${v - 6})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1);
  }
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 14; i += 1) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * n, Math.random() * n);
    ctx.lineTo(Math.random() * n, Math.random() * n);
    ctx.stroke();
  }
}

function brick(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#4a403c";
  ctx.fillRect(0, 0, n, n);
  const bh = 18;
  const bw = 42;
  for (let y = 0, row = 0; y < n; y += bh, row += 1) {
    const off = row % 2 === 0 ? 0 : bw / 2;
    for (let x = -bw; x < n; x += bw) {
      const r = 128 + ((x * 13 + y * 7) % 36);
      const g = 78 + ((x * 5 + y) % 22);
      const b = 62 + ((y * 3) % 16);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x + off + 1, y + 1, bw - 2, bh - 2);
    }
  }
}

function windows(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#121318";
  ctx.fillRect(0, 0, n, n);
  const cell = 18;
  for (let y = 8; y < n; y += cell) {
    for (let x = 8; x < n; x += cell) {
      if (Math.random() > 0.38) continue;
      const on = Math.random() > 0.45;
      ctx.fillStyle = on ? "#d4b07a" : "#1c1e24";
      ctx.fillRect(x, y, 7, 9);
    }
  }
}

function signTex() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#161518";
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "#eceae6";
  ctx.font = "700 52px 'Arial Narrow', Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("THE BLIND SPOT", 256, 52);
  ctx.font = "500 16px system-ui, sans-serif";
  ctx.fillStyle = "#9a9894";
  ctx.fillText("NIGHTLY DISAPPOINTMENT", 256, 96);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createMaterials() {
  const asphaltMap = canvasTex(256, asphalt, 14);
  const brickMap = canvasTex(256, brick, 3);
  const windowMap = canvasTex(256, windows, 2);
  const signMap = signTex();

  const mats = {
    asphalt: new THREE.MeshStandardMaterial({
      map: asphaltMap,
      roughness: 0.72,
      metalness: 0.06,
      color: "#d0cbc4",
    }),
    road: new THREE.MeshStandardMaterial({
      color: "#3a3632",
      roughness: 0.74,
      metalness: 0.06,
    }),
    brick: new THREE.MeshStandardMaterial({
      map: brickMap,
      roughness: 0.88,
      metalness: 0.02,
      color: "#e8d8cc",
    }),
    windows: new THREE.MeshStandardMaterial({
      map: windowMap,
      roughness: 0.5,
      metalness: 0.1,
      emissive: "#c9a46a",
      emissiveIntensity: 1.15,
    }),
    sign: new THREE.MeshBasicMaterial({ map: signMap }),
    skin: new THREE.MeshStandardMaterial({ color: "#e0b894", roughness: 0.65 }),
    skin2: new THREE.MeshStandardMaterial({ color: "#c4926a", roughness: 0.65 }),
    hair: new THREE.MeshStandardMaterial({ color: "#2a221e", roughness: 0.9 }),
    red: new THREE.MeshStandardMaterial({ color: "#c43c38", roughness: 0.5 }),
    navy: new THREE.MeshStandardMaterial({ color: "#3e5878", roughness: 0.55 }),
    jeans: new THREE.MeshStandardMaterial({ color: "#4a5a70", roughness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: "#3a3a40", roughness: 0.8 }),
    shoe: new THREE.MeshStandardMaterial({ color: "#2a2a2c", roughness: 0.5 }),
    crowd: [
      new THREE.MeshStandardMaterial({ color: "#4a4e56", roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: "#5a4c42", roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: "#3e4650", roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: "#6a5848", roughness: 0.7 }),
    ],
    phone: new THREE.MeshStandardMaterial({
      color: "#0e0e10",
      roughness: 0.35,
      metalness: 0.4,
    }),
    screen: new THREE.MeshBasicMaterial({ color: "#c9d4de" }),
    metal: new THREE.MeshStandardMaterial({
      color: "#3a3d42",
      roughness: 0.4,
      metalness: 0.6,
    }),
    bin: new THREE.MeshStandardMaterial({ color: "#243028", roughness: 0.7 }),
    glow: new THREE.MeshBasicMaterial({ color: "#ffe2b0" }),
    shadow: new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }),
    spark: new THREE.MeshBasicMaterial({ color: "#f2e6c9" }),
    copR: new THREE.MeshBasicMaterial({ color: "#c4453c" }),
    copB: new THREE.MeshBasicMaterial({ color: "#3a6aa8" }),
    dispose() {
      asphaltMap.dispose();
      brickMap.dispose();
      windowMap.dispose();
      signMap.dispose();
      for (const m of Object.values(this)) {
        if (m instanceof THREE.Material) m.dispose();
      }
      for (const m of this.crowd) m.dispose();
    },
  };
  return mats;
}

export type Mats = ReturnType<typeof createMaterials>;

export function createGeos() {
  const geos = {
    torso: new THREE.BoxGeometry(0.38, 0.52, 0.22),
    head: new THREE.SphereGeometry(0.128, 10, 8),
    hair: new THREE.SphereGeometry(0.134, 10, 8),
    arm: new THREE.BoxGeometry(0.09, 0.46, 0.09),
    leg: new THREE.BoxGeometry(0.12, 0.54, 0.12),
    foot: new THREE.BoxGeometry(0.12, 0.08, 0.22),
    phone: new THREE.BoxGeometry(0.07, 0.14, 0.018),
    shadow: new THREE.CircleGeometry(0.32, 12),
    dispose() {
      this.torso.dispose();
      this.head.dispose();
      this.hair.dispose();
      this.arm.dispose();
      this.leg.dispose();
      this.foot.dispose();
      this.phone.dispose();
      this.shadow.dispose();
    },
  };
  return geos;
}

export type Geos = ReturnType<typeof createGeos>;
