import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BCn4hhGU.mjs";
import { r as getSql } from "./db-BTUnGz53.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/takes-CBiHumsq.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var saveTake_createServerFn_handler = createServerRpc({
	id: "f990dd147cace07b7dc2ecb98d89ea46921f80e52400fa245256e7b4dfff3696",
	name: "saveTake",
	filename: "src/lib/takes.ts"
}, (opts) => saveTake.__executeServer(opts));
var saveTake = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({
	score: Math.max(0, Math.min(999999, Math.floor(Number(data.score) || 0))),
	clips: Math.max(0, Math.min(999, Math.floor(Number(data.clips) || 0))),
	grade: String(data.grade ?? "F").slice(0, 2),
	roast: String(data.roast ?? "").slice(0, 400)
})).handler(saveTake_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into fight_takes (user_id, score, clips, grade, roast)
      values (${context.userId}, ${data.score}, ${data.clips}, ${data.grade}, ${data.roast})`;
	return { ok: true };
});
var listTakes_createServerFn_handler = createServerRpc({
	id: "084c683e444b98c46100f562eaa96b0bedae4b01161dc132f3ce66293638aeb0",
	name: "listTakes",
	filename: "src/lib/takes.ts"
}, (opts) => listTakes.__executeServer(opts));
var listTakes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTakes_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, score, clips, grade, to_char(created_at, 'YYYY-MM-DD') as created_at,
        (tape_b64 is not null or replay_json is not null) as has_tape
      from fight_takes
      where user_id = ${context.userId}
      order by created_at desc
      limit 8
    `).map((r) => ({
		id: Number(r.id),
		score: r.score,
		clips: r.clips,
		grade: r.grade,
		created_at: r.created_at,
		hasTape: Boolean(r.has_tape)
	}));
});
//#endregion
export { listTakes_createServerFn_handler, saveTake_createServerFn_handler };
