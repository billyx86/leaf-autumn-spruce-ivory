export const input = {
  keys: new Set<string>(),
  lookX: 0,
  lookY: 0,
  zoomDelta: 0,
  joyX: 0,
  joyY: 0,
  panicQueued: false,
  pointerLocked: false,
  isTouch: false,
  target: null as HTMLElement | null,
};

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

function onKeyDown(e: KeyboardEvent) {
  if (isTypingTarget(e.target)) return;
  input.keys.add(e.code);
  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "ArrowDown" ||
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight"
  ) {
    e.preventDefault();
  }
  if (e.code === "Space") input.panicQueued = true;
}

function onKeyUp(e: KeyboardEvent) {
  input.keys.delete(e.code);
}

function onMouseMove(e: MouseEvent) {
  if (!input.pointerLocked) return;
  input.lookX += e.movementX;
  input.lookY += e.movementY;
}

function onWheel(e: WheelEvent) {
  if (!input.pointerLocked) return;
  e.preventDefault();
  input.zoomDelta += e.deltaY > 0 ? -0.35 : 0.35;
}

function onLockChange() {
  input.pointerLocked = document.pointerLockElement != null;
}

function onBlur() {
  input.keys.clear();
}

export function detectTouch() {
  if (typeof window === "undefined") return false;
  input.isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    window.innerWidth < 700;
  return input.isTouch;
}

export function setLockTarget(el: HTMLElement | null) {
  input.target = el;
}

export function lockPointer() {
  if (input.isTouch) return;
  void input.target?.requestPointerLock();
}

export function unlockPointer() {
  if (document.pointerLockElement) document.exitPointerLock();
}

export function consumeLook() {
  const x = input.lookX;
  const y = input.lookY;
  input.lookX = 0;
  input.lookY = 0;
  return { x, y };
}

export function consumeZoom() {
  const z = input.zoomDelta;
  input.zoomDelta = 0;
  return z;
}

export function consumePanic() {
  const p = input.panicQueued;
  input.panicQueued = false;
  return p;
}

export function attachInput() {
  detectTouch();
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("pointerlockchange", onLockChange);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onBlur);
}

export function detachInput() {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("wheel", onWheel);
  document.removeEventListener("pointerlockchange", onLockChange);
  window.removeEventListener("blur", onBlur);
  document.removeEventListener("visibilitychange", onBlur);
  input.keys.clear();
}

export function held(code: string) {
  return input.keys.has(code);
}
