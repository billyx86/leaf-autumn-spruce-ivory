"use client";

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { listTakes, saveTake, type SavedTake } from "@/lib/takes";
import { fetchReplay, keepTapeLocal, uploadTape } from "@/lib/tape-client";
import { readPendingTape } from "@/lib/tape-idb";
import { lastReplay, lastTape } from "@/game/recorder";
import { Button } from "@/components/ui/button";
import { useTape } from "@/game/store";
import { playSavedTape, returnToMenu, startTake, stopPlayback, watchTape } from "@/game/session";
import { lockPointer } from "@/game/input";
import { TouchPad } from "./TouchPad";
import { cn } from "@/lib/utils";

function formatTime(t: number) {
  const s = Math.max(0, Math.floor(t));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function AuthChip() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-elevated" />;
  }
  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-md border border-border bg-surface/80 px-3 py-2 text-sm text-fg"
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className="rounded-md border border-border bg-surface/80 px-2 py-1">
      <UserButton />
    </div>
  );
}

function TapeMedia({
  url,
  mime,
  className,
}: {
  url: string;
  mime: string;
  className?: string;
}) {
  if (mime.startsWith("image/")) {
    return <img src={url} alt="Your tape" className={className} />;
  }
  return (
    <video
      src={url}
      className={className}
      controls
      playsInline
      autoPlay
      muted
      loop
    />
  );
}

function Menu() {
  const { user } = useCurrentUserState();
  const [takes, setTakes] = useState<SavedTake[]>([]);
  const [best, setBest] = useState(0);
  const [watchBusy, setWatchBusy] = useState(false);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem("bad-angle-best") || "0"));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let live = true;
    void (async () => {
      const pending = await readPendingTape();
      if (pending?.replay?.keys?.length) {
        try {
          await uploadTape(
            {
              score: pending.score,
              clips: pending.clips,
              grade: pending.grade,
              roast: pending.roast,
            },
            pending.replay ?? { keys: [], len: 0 },
            pending.blob.size > 100 ? pending.blob : null,
            pending.mime,
          );
        } catch {
          /* still list what we have */
        }
      }
      try {
        const rows = await listTakes();
        if (live) setTakes(rows);
      } catch {
        if (live) setTakes([]);
      }
    })();
    return () => {
      live = false;
    };
  }, [user]);

  async function playSaved(id: number) {
    setWatchBusy(true);
    try {
      const replay = await fetchReplay(id);
      playSavedTape(replay);
    } catch {
      /* ignore */
    } finally {
      setWatchBusy(false);
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
      <div className="pointer-events-auto flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Outside The Blind Spot
        </p>
        <AuthChip />
      </div>
      <div className="max-w-xl">
        <p className="mb-2 font-mono text-xs tracking-[0.22em] text-muted uppercase">
          Fight filmer simulator
        </p>
        <h1 className="font-display text-6xl leading-[0.9] font-bold tracking-tight text-fg sm:text-8xl">
          BAD
          <br />
          ANGLE
        </h1>
        <p className="mt-5 max-w-sm text-base text-muted">
          You are the cameraman. You are not good at this. Keep the scrap in
          frame, try not to film the tarmac, and whatever you do — don't get
          excited.
        </p>
        <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => startTake()}>
            Start the take
          </Button>
          {best > 0 ? (
            <p className="font-mono text-xs text-muted">Best {best.toLocaleString()}</p>
          ) : null}
        </div>
        <dl className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] text-subtle uppercase">
          <div>WASD / stick</div>
          <div>Move</div>
          <div>Mouse / drag</div>
          <div>Aim the phone</div>
          <div>Shift</div>
          <div>Run (worse)</div>
          <div>Scroll / Q E</div>
          <div>Zoom hunt</div>
          <div>Space / OI</div>
          <div>Shout</div>
        </dl>
        {takes.length > 0 ? (
          <div className="pointer-events-auto mt-6 max-w-sm">
            <p className="mb-2 font-mono text-[11px] tracking-widest text-subtle uppercase">
              Saved tapes
            </p>
            <ul className="space-y-1 text-sm text-muted">
              {takes.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 font-mono">
                  <span>
                    {t.grade} · {t.score.toLocaleString()}
                  </span>
                  {t.hasTape ? (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-1 rounded-sm px-2 text-fg hover:bg-elevated"
                      onClick={() => void playSaved(t.id)}
                    >
                      <Play className="size-3.5" />
                      Play
                    </button>
                  ) : (
                    <span className="text-subtle">No tape</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {watchBusy ? (
        <p className="pointer-events-auto font-mono text-[11px] tracking-widest text-muted uppercase">
          Loading tape…
        </p>
      ) : null}
    </div>
  );
}

function Hud() {
  const takeTime = useTape((s) => s.takeTime);
  const takeLen = useTape((s) => s.takeLen);
  const viral = useTape((s) => s.viral);
  const clips = useTape((s) => s.clips);
  const zoom = useTape((s) => s.zoom);
  const battery = useTape((s) => s.battery);
  const note = useTape((s) => s.note);
  const event = useTape((s) => s.event);
  const flash = useTape((s) => s.flash);
  const caption = useTape((s) => s.caption);
  const missing = useTape((s) => s.missing);
  const inFrame = useTape((s) => s.inFrame);
  const left = Math.max(0, takeLen - takeTime);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-3 rounded-[28px] border border-fg/20 shadow-[inset_0_0_56px_rgba(0,0,0,0.28)] sm:inset-4" />
      <div className="absolute top-6 right-6 left-6 flex items-start justify-between font-mono text-[11px] tracking-widest text-fg sm:top-8 sm:right-8 sm:left-8">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rec" />
          <span>REC {formatTime(takeTime)}</span>
        </div>
        <span>{zoom.toFixed(1)}×</span>
        <span className={cn(battery < 8 && "text-rec")}>{Math.round(battery)}%</span>
      </div>
      <div className="absolute top-1/2 right-6 h-32 w-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-fg/15 sm:right-8">
        <div
          className="absolute right-0 bottom-0 left-0 bg-fg"
          style={{ height: `${Math.round(viral)}%` }}
        />
      </div>
      <div className="absolute right-10 bottom-24 left-10 text-center sm:bottom-28">
        {flash ? (
          <p className="font-display text-5xl font-bold tracking-tight text-fg sm:text-7xl">
            {flash}
          </p>
        ) : null}
        {caption ? (
          <p className="mt-2 font-display text-2xl tracking-wide text-fg">{caption}</p>
        ) : null}
      </div>
      <div className="absolute right-8 bottom-8 left-8 flex items-end justify-between gap-4">
        <p className="max-w-sm text-sm text-fg/90">{note}</p>
        <div className="font-mono text-[11px] tracking-widest text-muted uppercase">
          {inFrame}/2 in frame · {clips} clips · {formatTime(left)} left
        </div>
      </div>
      {event === "finger" ? (
        <div className="absolute top-[-10%] left-[-8%] h-[70%] w-[55%] rounded-full bg-bg/85 blur-md" />
      ) : null}
      {event === "flash" ? <div className="absolute inset-0 bg-fg/80" /> : null}
      {missing ? (
        <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-bg/40">
          <button
            type="button"
            onClick={() => lockPointer()}
            className="rounded-lg border border-border bg-surface px-6 py-4 text-left"
          >
            <p className="font-display text-2xl">Click to keep filming</p>
            <p className="mt-1 text-sm text-muted">You're missing it.</p>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Results() {
  const results = useTape((s) => s.results);
  const tapeUrl = useTape((s) => s.tapeUrl);
  const tapeMime = useTape((s) => s.tapeMime);
  const tapeRoll = useTape((s) => s.tapeRoll);
  const tapeSaved = useTape((s) => s.tapeSaved);
  const tapeSaving = useTape((s) => s.tapeSaving);
  const { user } = useCurrentUserState();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!results) return;
    try {
      const best = Number(localStorage.getItem("bad-angle-best") || "0");
      if (results.score > best) {
        localStorage.setItem("bad-angle-best", String(results.score));
      }
    } catch {
      /* ignore */
    }
  }, [results]);

  useEffect(() => {
    if (!results || (tapeRoll !== "ready" && tapeRoll !== "replay")) return;
    const replay = lastReplay();
    if (!replay?.keys.length) return;
    const tape = lastTape();
    void keepTapeLocal(
      {
        score: results.score,
        clips: results.clips,
        grade: results.grade,
        roast: results.roast,
      },
      replay,
      tape?.blob,
      tape?.mime,
    );
  }, [results, tapeRoll]);

  useEffect(() => {
    if (!results || !user || saved) return;
    if (tapeRoll === "recording" || tapeRoll === "idle") return;
    const replay = lastReplay();
    if (!replay?.keys.length) return;
    setSaved(true);
    const tape = lastTape();
    const meta = {
      score: results.score,
      clips: results.clips,
      grade: results.grade,
      roast: results.roast,
    };
    useTape.setState({ tapeSaving: true });
    void uploadTape(meta, replay, tape?.blob, tape?.mime)
      .then((id) => {
        useTape.setState({ tapeSaved: true, tapeSaving: false, tapeId: id });
      })
      .catch(() => {
        useTape.setState({ tapeSaving: false });
        void saveTake({ data: meta }).catch(() => {});
      });
  }, [results, user, saved, tapeRoll]);

  if (!results) return null;

  const ext = tapeMime.includes("mp4") ? "mp4" : tapeMime.includes("jpeg") ? "jpg" : "webm";

  return (
    <div className="pointer-events-auto absolute inset-0 overflow-y-auto bg-bg/55 p-5 sm:p-8">
      <div className="flex min-h-full items-end">
        <div className="w-full max-w-lg rounded-xl border border-border bg-surface/95 p-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
            Take in the can
          </p>
          {tapeRoll === "ready" && tapeUrl ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-bg">
              <TapeMedia
                url={tapeUrl}
                mime={tapeMime}
                className="aspect-video w-full object-cover"
              />
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {tapeRoll === "failed"
                ? "Couldn't roll a file. The take is still on the camera."
                : tapeRoll === "recording"
                  ? "Developing tape…"
                  : "Your awful camerawork is in the can. Watch it back."}
            </p>
          )}
          <div className="mt-4 flex items-end justify-between gap-4">
            <h2 className="font-display text-7xl leading-none font-bold">{results.grade}</h2>
            <p className="font-mono text-2xl tabular-nums">{results.score.toLocaleString()}</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{results.roast}</p>
          <dl className="mt-5 grid grid-cols-2 gap-2 font-mono text-[11px] text-subtle uppercase">
            <div>On subject {results.subjectPct}%</div>
            <div>Clips {results.clips}</div>
            <div>Pavement {results.feet}s</div>
            <div>Sky {results.sky}s</div>
            <div>Got hit {results.hitsTaken}</div>
            <div>Finger {results.fingers}×</div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => startTake()}>Another take</Button>
            <Button variant="secondary" onClick={() => watchTape("results")}>
              Watch tape
            </Button>
            <Button variant="secondary" onClick={() => returnToMenu()}>
              Back
            </Button>
            {tapeUrl ? (
              <Button variant="secondary" asChild>
                <a href={tapeUrl} download={`bad-angle-${results.grade}.${ext}`}>
                  Download
                </a>
              </Button>
            ) : null}
          </div>
          <p className="mt-4 text-sm text-muted">
            <SignedOut>
              <Link to="/login" className="text-fg underline-offset-4 hover:underline">
                Sign in to keep this tape on your account
              </Link>
            </SignedOut>
            <SignedIn>
              {tapeSaving
                ? "Saving tape to your account…"
                : tapeSaved
                  ? "Tape saved to your account."
                  : "Saving…"}
            </SignedIn>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Overlay() {
  const phase = useTape((s) => s.phase);
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 700,
    );
  }, []);

  return (
    <>
      {phase === "menu" ? <Menu /> : null}
      {phase === "playing" || phase === "replay" ? <Hud /> : null}
      {phase === "playing" && touch ? <TouchPad /> : null}
      {phase === "replay" ? (
        <div className="pointer-events-auto absolute right-5 bottom-5 sm:right-8 sm:bottom-8">
          <Button variant="secondary" onClick={() => stopPlayback()}>
            Stop playback
          </Button>
        </div>
      ) : null}
      {phase === "results" ? <Results /> : null}
    </>
  );
}
