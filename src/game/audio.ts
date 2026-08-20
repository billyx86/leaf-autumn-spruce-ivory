type Handle = {
  unlock: () => void;
  recBeep: () => void;
  punch: (heavy: boolean) => void;
  whoa: () => void;
  shove: () => void;
  startCrowd: () => void;
  stopCrowd: () => void;
  setCrowdHeat: (v: number) => void;
  siren: () => void;
};

function makeNoise(ctx: AudioContext, seconds: number) {
  const n = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i += 1) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function createTapeAudio(): Handle {
  let ctx: AudioContext | null = null;
  let crowdGain: GainNode | null = null;
  let crowdSrc: AudioBufferSourceNode | null = null;
  let heat = 0.08;

  function ensure() {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  return {
    unlock() {
      ensure();
    },
    recBeep() {
      const ac = ensure();
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "square";
      o.frequency.value = 1480;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + 0.1);
    },
    punch(heavy) {
      const ac = ensure();
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(heavy ? 64 : 108, t);
      o.frequency.exponentialRampToValueAtTime(28, t + 0.14);
      g.gain.setValueAtTime(heavy ? 0.42 : 0.24, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + 0.17);

      const src = ac.createBufferSource();
      src.buffer = makeNoise(ac, 0.08);
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = heavy ? 420 : 900;
      bp.Q.value = 0.7;
      const ng = ac.createGain();
      ng.gain.setValueAtTime(heavy ? 0.22 : 0.12, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      src.connect(bp);
      bp.connect(ng);
      ng.connect(ac.destination);
      src.start(t);
    },
    whoa() {
      const ac = ensure();
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(140, t + 0.18);
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + 0.22);
    },
    shove() {
      const ac = ensure();
      const t = ac.currentTime;
      const src = ac.createBufferSource();
      src.buffer = makeNoise(ac, 0.16);
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 280;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      src.connect(lp);
      lp.connect(g);
      g.connect(ac.destination);
      src.start(t);
    },
    startCrowd() {
      const ac = ensure();
      this.stopCrowd();
      const src = ac.createBufferSource();
      src.buffer = makeNoise(ac, 2);
      src.loop = true;
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 480;
      const g = ac.createGain();
      g.gain.value = heat;
      src.connect(lp);
      lp.connect(g);
      g.connect(ac.destination);
      src.start();
      crowdSrc = src;
      crowdGain = g;
    },
    stopCrowd() {
      try {
        crowdSrc?.stop();
      } catch {
        /* already stopped */
      }
      crowdSrc = null;
      crowdGain = null;
    },
    setCrowdHeat(v: number) {
      heat = 0.05 + v * 0.12;
      if (crowdGain && ctx) {
        crowdGain.gain.setTargetAtTime(heat, ctx.currentTime, 0.2);
      }
    },
    siren() {
      const ac = ensure();
      const t = ac.currentTime;
      for (let i = 0; i < 6; i += 1) {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "sine";
        o.frequency.value = i % 2 === 0 ? 680 : 910;
        const start = t + i * 0.28;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.07, start + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);
        o.connect(g);
        g.connect(ac.destination);
        o.start(start);
        o.stop(start + 0.28);
      }
    },
  };
}

export const tapeAudio = createTapeAudio();
