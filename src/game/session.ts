import { resetSim } from "./sim";
import { abortTape, lastReplay, setReplay, type PackedTape } from "./recorder";
import { resetHud, useTape } from "./store";
import { lockPointer } from "./input";
import { tapeAudio } from "./audio";

export function startTake() {
  abortTape();
  resetSim();
  resetHud();
  tapeAudio.unlock();
  tapeAudio.recBeep();
  tapeAudio.startCrowd();
  lockPointer();
}

export function returnToMenu() {
  resetSim();
  tapeAudio.stopCrowd();
  useTape.setState({
    phase: "menu",
    results: null,
    score: 0,
    clips: 0,
    viral: 0,
    takeTime: 0,
    note: "Keep them in frame. You won't.",
    missing: false,
    sirens: false,
    flash: "",
    caption: "",
    event: "none",
  });
}

export function watchTape(from: "menu" | "results" = "results") {
  const tape = lastReplay();
  if (!tape || tape.keys.length < 2) return;
  setReplay(tape);
  tapeAudio.unlock();
  tapeAudio.startCrowd();
  useTape.setState({
    phase: "replay",
    replayFrom: from,
    takeTime: 0,
    takeLen: tape.len,
    event: "none",
    missing: false,
    flash: "",
    caption: "",
    note: "This is what you shot.",
  });
}

export function playSavedTape(data: PackedTape) {
  setReplay(data);
  watchTape("menu");
}

export function stopPlayback() {
  const from = useTape.getState().replayFrom ?? "results";
  if (from === "menu") tapeAudio.stopCrowd();
  useTape.setState({ phase: from, event: "none" });
}
