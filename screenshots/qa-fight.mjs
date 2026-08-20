import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function shot(page, path) {
  await page.screenshot({ path, animations: "disabled" });
}

const errors = [];
function hook(page) {
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
}

const desk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
hook(desk);
await desk.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await desk.waitForSelector("canvas", { timeout: 25000 });
await desk.waitForTimeout(800);
await shot(desk, "/workspace/screenshots/app-builder-preview.png");
await shot(desk, "/workspace/screenshots/menu-wait.png");

await desk.goto("http://127.0.0.1:8080/?qa=1", { waitUntil: "networkidle" });
await desk.waitForSelector("canvas", { timeout: 25000 });
await desk.waitForTimeout(400);
await desk.getByRole("button", { name: /start the take/i }).click();
await desk.waitForTimeout(500);
await shot(desk, "/workspace/screenshots/playing.png");

const probe = await desk.evaluate(async () => {
  const t = window.__controlsTest;
  if (!t) return { ok: false, reason: "no probe" };
  t.setKeys?.([]);
  await new Promise((r) => setTimeout(r, 50));
  const yaw = t.getYaw();
  const p0 = t.getPosition();
  t.setKeys?.(["KeyA"]);
  await new Promise((r) => setTimeout(r, 500));
  const pA = t.getPosition();
  t.setKeys?.(["KeyD"]);
  await new Promise((r) => setTimeout(r, 800));
  const pD = t.getPosition();
  t.setKeys?.(["KeyW"]);
  await new Promise((r) => setTimeout(r, 400));
  const pW = t.getPosition();
  t.setKeys?.([]);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);
  const dAx = pA.x - p0.x, dAz = pA.z - p0.z;
  const dDx = pD.x - pA.x, dDz = pD.z - pA.z;
  const alongA = dAx * -rightX + dAz * -rightZ; // A should be + along -right
  const alongD = dDx * rightX + dDz * rightZ; // D should be + along +right
  return { ok: true, yaw, p0, pA, pD, pW, alongA, alongD, speed: t.getSpeed() };
});
console.log("CONTROLS", JSON.stringify(probe, null, 2));
await shot(desk, "/workspace/screenshots/playing-moved.png");

const mob = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
hook(mob);
await mob.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mob.waitForSelector("canvas", { timeout: 25000 });
await mob.waitForTimeout(800);
await shot(mob, "/workspace/screenshots/app-builder-preview-mobile.png");
await mob.getByRole("button", { name: /start the take/i }).click();
await mob.waitForTimeout(800);
await shot(mob, "/workspace/screenshots/playing-mobile.png");

console.log("ERRORS", JSON.stringify(errors, null, 2));
await browser.close();
