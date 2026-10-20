// Receives today's step count from an iPhone Shortcut (Apple Health) and stores it in the habits record.
// The Shortcut sends header x-token: <personal key from the app's Settings>, JSON body {"steps": 8123, "date": "YYYY-MM-DD" (optional)}.
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const reply = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  // Accepts either POST {steps} with header x-token, or a single link: GET/POST ?k=<key>&steps=<number> (easiest Shortcut).
  const url = new URL(req.url);
  const token = req.headers.get("x-token") ?? url.searchParams.get("k") ?? "";
  const { data: t } = await sb.from("health_tokens").select("user_id").eq("token", token).maybeSingle();
  if (!t) return reply({ error: "Unknown key" }, 403);
  const body: Record<string, unknown> = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  if (url.searchParams.get("steps") != null) body.steps = url.searchParams.get("steps");
  if (url.searchParams.get("date")) body.date = url.searchParams.get("date");
  const raw = String(body.steps ?? "").replace(/[^0-9.]/g, "");
  const steps = Math.round(Number(raw));
  if (!raw || !Number.isFinite(steps) || steps < 0 || steps > 200000) return reply({ error: "steps must be a number" }, 400);
  const tz = String(body.tz || "Europe/London");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date || "")) ? String(body.date)
    : new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const path = `habits/${date}`;
  const { data: cur } = await sb.from("docs").select("data").eq("user_id", t.user_id).eq("path", path).maybeSingle();
  const data = { ...(cur?.data ?? {}), date, phone: steps, schema: 2, phoneSource: "health" };
  const { error } = await sb.from("docs").upsert({ user_id: t.user_id, path, col: "habits", data, deleted: false }, { onConflict: "user_id,path" });
  if (error) return reply({ error: error.message }, 500);
  return reply({ ok: true, date, steps });
});
