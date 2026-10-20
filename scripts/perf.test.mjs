import assert from "node:assert/strict";
import { test } from "node:test";
import { ALPHA, classifyFrameMs, createFrameMeter } from "../src/game/perf.mjs";

test("fresh meter reports 0 fps / 0 ms before any sample", () => {
  const m = createFrameMeter();
  assert.equal(m.fps, 0);
  assert.equal(m.ms, 0);
  assert.equal(m.readout(), "0 fps · 0.0 ms");
});

test("first sample seeds the estimate exactly (no EMA applied yet)", () => {
  const m = createFrameMeter();
  m.tick(16.4);
  assert.ok(Math.abs(m.ms - 16.4) < 1e-9);
  assert.equal(m.fps, Math.round(1000 / 16.4)); // 61
});

test("steady frames settle at the constant value", () => {
  const m = createFrameMeter();
  for (let i = 0; i < 200; i += 1) m.tick(16.666); // 60 fps
  assert.ok(Math.abs(m.ms - 16.666) < 0.05);
  assert.equal(m.fps, 60);
});

test("EMA smooths toward a new value by the ALPHA factor", () => {
  const m = createFrameMeter();
  m.tick(10); // seed
  m.tick(20); // one step toward 20
  const expected = 10 + (20 - 10) * ALPHA;
  assert.ok(Math.abs(m.ms - expected) < 1e-9);
});

test("non-positive and NaN samples are ignored", () => {
  const m = createFrameMeter();
  m.tick(16.4);
  const before = m.ms;
  m.tick(0);
  m.tick(-5);
  m.tick(Number.NaN);
  assert.ok(Math.abs(m.ms - before) < 1e-9);
});

test("readout formats '<fps> fps · <ms> ms' with one decimal", () => {
  const m = createFrameMeter();
  m.tick(33.33); // ~30 fps
  const out = m.readout();
  assert.match(out, /^\d+ fps · \d+\.\d ms$/);
  assert.ok(out.startsWith("30 fps"));
});

test("classifyFrameMs maps frame time to a severity tier", () => {
  assert.equal(classifyFrameMs(0), "idle");
  assert.equal(classifyFrameMs(Number.NaN), "idle");
  assert.equal(classifyFrameMs(-3), "idle");
  assert.equal(classifyFrameMs(8.0), "ok"); // ~125 fps
  assert.equal(classifyFrameMs(16.7), "ok"); // boundary, 60 fps
  assert.equal(classifyFrameMs(17.0), "warn");
  assert.equal(classifyFrameMs(33.4), "warn"); // boundary, ~30 fps
  assert.equal(classifyFrameMs(40.0), "bad");
  assert.equal(classifyFrameMs(250.0), "bad");
});
