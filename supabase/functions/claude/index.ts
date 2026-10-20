// Proxies the app's Claude requests to the Anthropic API. The API key never reaches the phone.
// Secrets: ANTHROPIC_API_KEY or AJ_TRAINING_ANTHROPIC_KEY (required), ALLOWED_EMAILS (optional, comma-separated), MODEL_QUICK/MODEL_DEFAULT/MODEL_COMPLEX (optional).
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
// Each job uses the cheapest model that does it well. Effort controls how much the model thinks (and costs).
const TIERS: Record<string, { model: string; effort: string }> = {
  quick:   { model: Deno.env.get("MODEL_QUICK") ?? "claude-haiku-5-5", effort: "low" },     // barcode digits, small lookups
  coach:   { model: Deno.env.get("MODEL_COACH") ?? "claude-haiku-5-5", effort: "medium" },  // chat + logging food/cardio/habits
  default: { model: Deno.env.get("MODEL_DEFAULT") ?? "claude-sonnet-5-5", effort: "low" },  // label reading, food lookups
  complex: { model: Deno.env.get("MODEL_COMPLEX") ?? "claude-opus-5-5", effort: "medium" }, // body fat from photos
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ type: "error", error: { type: "method", message: "POST only" } }, 405);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ type: "error", error: { type: "auth", message: "Not signed in" } }, 401);
  const allowed = (Deno.env.get("ALLOWED_EMAILS") ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (allowed.length && !allowed.includes((user.email ?? "").toLowerCase())) return json({ type: "error", error: { type: "auth", message: "Not allowed" } }, 403);

  const body = await req.json().catch(() => ({}));
  if (!Array.isArray(body.messages) || !body.messages.length) return json({ type: "error", error: { type: "invalid", message: "messages required" } }, 400);
  const payload: Record<string, unknown> = {
    model: (TIERS[body.tier] ?? TIERS.default).model,
    max_tokens: Math.min(Math.max(Number(body.max_tokens) || 2048, 256), 8192),
    output_config: { effort: (TIERS[body.tier] ?? TIERS.default).effort },
    messages: body.messages,
  };
  if (Array.isArray(body.tools) && body.tools.length) payload.tools = body.tools.slice(0, 16);
  if (typeof body.system === "string") payload.system = body.system;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": (Deno.env.get("ANTHROPIC_API_KEY") ?? Deno.env.get("AJ_TRAINING_ANTHROPIC_KEY"))!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return new Response(await r.text(), { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
});
