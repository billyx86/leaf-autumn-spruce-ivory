import { create } from "zustand";
import type { CamEvent, TakeResults } from "./sim";

export type TapePhase = "menu" | "playing" | "results" | "replay";
export type TapeRoll = "idle" | "recording" | "ready" | "replay" | "failed";

export type TapeHud = {
  phase: TapePhase;
  takeTime: number;
  takeLen: number;
  score: number;
  viral: number;
  clips: number;
  zoom: number;
  battery: number;
  note: string;
  event: CamEvent;
  flash: string;
  caption: string;
  inFrame: number;
  missing: boolean;
  sirens: boolean;
  results: TakeResults | null;
  tapeUrl: string | null;
  tapeMime: string;
  tapeRoll: TapeRoll;
  tapeSaved: boolean;
  tapeSaving: boolean;
  tapeId: number | null;
  replayFrom: "menu" | "results";
};

const initial: Omit<TapeHud, "set"> = {
  phase: "menu",
  takeTime: 0,
  takeLen: 68,
  score: 0,
  viral: 0,
  clips: 0,
  zoom: 1,
  battery: 18,
  note: "Keep them in frame. You won't.",
  event: "none",
  flash: "",
  caption: "",
  inFrame: 0,
  missing: false,
  sirens: false,
  results: null,
  tapeUrl: null,
  tapeMime: "",
  tapeRoll: "idle",
  tapeSaved: false,
  tapeSaving: false,
  tapeId: null,
  replayFrom: "results",
};

type TapeStore = TapeHud & { set: (p: Partial<TapeHud>) => void };

export const useTape = create<TapeStore>((set) => ({
  ...initial,
  set: (p) => set(p),
}));

export function resetHud() {
  const prev = useTape.getState().tapeUrl;
  if (prev) URL.revokeObjectURL(prev);
  useTape.setState({
    ...initial,
    phase: "playing",
    tapeRoll: "recording",
  });
}
