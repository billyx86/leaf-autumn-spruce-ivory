import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

const MAX_BYTES = 2_400_000;

async function userIdFromRequest() {
  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  const { requireUserId } = await import("@/lib/auth/verify.server");
  assertSameSiteRequest();
  const request = getRequest();
  const authz = request?.headers.get("authorization");
  const bearer = authz?.toLowerCase().startsWith("bearer ")
    ? authz.slice(7).trim()
    : undefined;
  return requireUserId(bearer);
}

export const Route = createFileRoute("/api/tape")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const userId = await userIdFromRequest();
          const form = await request.formData();
          const replayRaw = String(form.get("replay") ?? "");
          if (!replayRaw || replayRaw.length > 400_000) {
            return Response.json({ error: "missing tape" }, { status: 400 });
          }
          let replay: unknown;
          try {
            replay = JSON.parse(replayRaw);
          } catch {
            return Response.json({ error: "bad tape" }, { status: 400 });
          }
          const replayJson = JSON.stringify(replay).slice(0, 400_000);
          const score = Math.max(0, Math.min(999999, Math.floor(Number(form.get("score")) || 0)));
          const clips = Math.max(0, Math.min(999, Math.floor(Number(form.get("clips")) || 0)));
          const grade = String(form.get("grade") ?? "F").slice(0, 2);
          const roast = String(form.get("roast") ?? "").slice(0, 400);

          let b64: string | null = null;
          let mime: string | null = null;
          const tape = form.get("tape");
          if (tape && typeof tape === "object" && "arrayBuffer" in tape) {
            const buf = Buffer.from(await (tape as Blob).arrayBuffer());
            if (buf.length >= 200 && buf.length <= MAX_BYTES) {
              b64 = buf.toString("base64");
              mime = ((tape as Blob).type || "video/webm").slice(0, 80);
            }
          }

          const sql = await getSql();
          const rows = await sql.query<{ id: number }>(
            `insert into fight_takes (user_id, score, clips, grade, roast, tape_b64, tape_mime, replay_json)
             values ($1,$2,$3,$4,$5,$6,$7,$8)
             returning id`,
            [userId, score, clips, grade, roast, b64, mime, replayJson],
          );
          await sql.query(
            `with keep as (
               select id from fight_takes
               where user_id = $1 and tape_b64 is not null
               order by created_at desc
               limit 6
             )
             update fight_takes set tape_b64 = null, tape_mime = null
             where user_id = $1
               and tape_b64 is not null
               and id not in (select id from keep)`,
            [userId],
          );
          return Response.json({ id: Number(rows[0]?.id) });
        } catch (err) {
          const status = (err as { status?: number }).status;
          if (status === 401) return Response.json({ error: "Unauthorized" }, { status: 401 });
          if (status === 403) return Response.json({ error: "Forbidden" }, { status: 403 });
          console.error(err);
          return Response.json({ error: "save failed" }, { status: 500 });
        }
      },
    },
  },
});
