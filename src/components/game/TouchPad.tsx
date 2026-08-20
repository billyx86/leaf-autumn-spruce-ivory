"use client";

import { useRef } from "react";
import { input } from "@/game/input";

function stickFromEvent(el: HTMLElement, e: React.PointerEvent) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let x = (e.clientX - cx) / (r.width * 0.5);
  let y = (e.clientY - cy) / (r.height * 0.5);
  const m = Math.hypot(x, y);
  if (m > 1) {
    x /= m;
    y /= m;
  }
  input.joyX = x;
  input.joyY = y;
}

export function TouchPad() {
  const lookLast = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0 md:hidden">
      <div
        className="pointer-events-auto absolute inset-0"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-touch-ui]")) return;
          lookLast.current = { x: e.clientX, y: e.clientY };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!lookLast.current) return;
          input.lookX += e.clientX - lookLast.current.x;
          input.lookY += e.clientY - lookLast.current.y;
          lookLast.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          lookLast.current = null;
        }}
      />
      <div
        data-touch-ui
        className="pointer-events-auto absolute bottom-6 left-4 size-28 rounded-full border border-border bg-surface/70"
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          stickFromEvent(e.currentTarget, e);
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          stickFromEvent(e.currentTarget, e);
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          input.joyX = 0;
          input.joyY = 0;
        }}
        onPointerCancel={() => {
          input.joyX = 0;
          input.joyY = 0;
        }}
      >
        <div className="absolute inset-[42%] rounded-full bg-fg/70" />
      </div>
      <div data-touch-ui className="pointer-events-auto absolute right-4 bottom-6 flex flex-col gap-2">
        <button
          type="button"
          className="h-12 w-12 rounded-lg border border-border bg-surface/80 font-display text-lg text-fg"
          onPointerDown={(e) => {
            e.stopPropagation();
            input.zoomDelta += 0.4;
          }}
        >
          +
        </button>
        <button
          type="button"
          className="h-12 w-12 rounded-lg border border-border bg-surface/80 font-display text-lg text-fg"
          onPointerDown={(e) => {
            e.stopPropagation();
            input.zoomDelta -= 0.4;
          }}
        >
          −
        </button>
        <button
          type="button"
          className="h-12 w-12 rounded-lg bg-rec font-display text-[10px] tracking-wide text-fg"
          onPointerDown={(e) => {
            e.stopPropagation();
            input.panicQueued = true;
          }}
        >
          OI
        </button>
      </div>
    </div>
  );
}
