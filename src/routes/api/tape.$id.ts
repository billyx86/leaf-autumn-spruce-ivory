import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

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

export const Route = createFileRoute("/api/tape/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const userId = await userIdFromRequest();
          const id = Number(params.id);
          if (!Number.isFinite(id)) {
            return Response.json({ error: "missing" }, { status: 400 });
          }
          const sql = await getSql();
          const rows = await sql.query<{
            replay_json: string | null;
            tape_mime: string | null;
            tape_b64: string | null;
          }>(
            `select replay_json, tape_mime, tape_b64 from fight_takes
             where id = $1 and user_id = $2 limit 1`,
            [id, userId],
          );
          const row = rows[0];
          if (!row?.replay_json) {
            return Response.json({ error: "missing" }, { status: 404 });
          }
          let replay: unknown = null;
          try {
            replay = JSON.parse(row.replay_json);
          } catch {
            return Response.json({ error: "bad tape" }, { status: 500 });
          }
          return Response.json({
            replay,
            mime: row.tape_mime,
            hasVideo: Boolean(row.tape_b64),
          });
        } catch (err) {
          const status = (err as { status?: number }).status;
          if (status === 401) return Response.json({ error: "Unauthorized" }, { status: 401 });
          if (status === 403) return Response.json({ error: "Forbidden" }, { status: 403 });
          console.error(err);
          return Response.json({ error: "failed" }, { status: 500 });
        }
      },
    },
  },
});
