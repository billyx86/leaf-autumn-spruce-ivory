import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type SavedTake = {
  id: number;
  score: number;
  clips: number;
  grade: string;
  created_at: string;
  hasTape: boolean;
};

export const saveTake = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { score: number; clips: number; grade: string; roast: string }) => ({
    score: Math.max(0, Math.min(999999, Math.floor(Number(data.score) || 0))),
    clips: Math.max(0, Math.min(999, Math.floor(Number(data.clips) || 0))),
    grade: String(data.grade ?? "F").slice(0, 2),
    roast: String(data.roast ?? "").slice(0, 400),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`insert into fight_takes (user_id, score, clips, grade, roast)
      values (${context.userId}, ${data.score}, ${data.clips}, ${data.grade}, ${data.roast})`;
    return { ok: true as const };
  });

export const listTakes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      score: number;
      clips: number;
      grade: string;
      created_at: string;
      has_tape: boolean;
    }>`
      select id, score, clips, grade, to_char(created_at, 'YYYY-MM-DD') as created_at,
        (tape_b64 is not null or replay_json is not null) as has_tape
      from fight_takes
      where user_id = ${context.userId}
      order by created_at desc
      limit 8
    `;
    return rows.map((r) => ({
      id: Number(r.id),
      score: r.score,
      clips: r.clips,
      grade: r.grade,
      created_at: r.created_at,
      hasTape: Boolean(r.has_tape),
    })) satisfies SavedTake[];
  });
