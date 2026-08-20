import { getBearerToken } from "@/lib/auth/client";
import { clearPendingTape, stashPendingTape, type PendingTape } from "./tape-idb";
import type { PackedTape } from "@/game/recorder";

function authHeaders(): HeadersInit {
  const token = getBearerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type TapeMeta = {
  score: number;
  clips: number;
  grade: string;
  roast: string;
};

export async function uploadTape(
  meta: TapeMeta,
  replay: PackedTape,
  blob?: Blob | null,
  mime?: string,
) {
  const fd = new FormData();
  fd.set("replay", JSON.stringify(replay));
  fd.set("score", String(meta.score));
  fd.set("clips", String(meta.clips));
  fd.set("grade", meta.grade);
  fd.set("roast", meta.roast);
  if (blob && mime) {
    const ext = mime.includes("mp4") ? "mp4" : mime.includes("jpeg") ? "jpg" : "webm";
    fd.set("tape", blob, `take.${ext}`);
  }
  const res = await fetch("/api/tape", {
    method: "POST",
    body: fd,
    headers: authHeaders(),
    credentials: "include",
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("save failed");
  const json = (await res.json()) as { id: number };
  await clearPendingTape();
  return json.id;
}

export async function fetchReplay(id: number): Promise<PackedTape> {
  const res = await fetch(`/api/tape/${id}`, {
    headers: authHeaders(),
    credentials: "include",
  });
  if (!res.ok) throw new Error("missing tape");
  const json = (await res.json()) as { replay: PackedTape };
  if (!json.replay?.keys?.length) throw new Error("empty tape");
  return json.replay;
}

export async function keepTapeLocal(
  meta: TapeMeta,
  replay: PackedTape,
  blob?: Blob | null,
  mime?: string,
) {
  const entry: PendingTape = {
    ...meta,
    replay,
    blob: blob ?? new Blob(),
    mime: mime ?? "",
    at: Date.now(),
  };
  await stashPendingTape(entry);
}