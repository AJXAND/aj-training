// Sends rest-timer alerts that are due. pg_cron calls this every 5 seconds, but only when a timer is due
// (see supabase/cron.sql), so it runs only during workouts. Calling it early does nothing: it only sends due timers.
// Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (shared with weighin-push).
import { createClient } from "npm:@supabase/supabase-js@2.117.2";
import webpush from "npm:web-push@3.6.7";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@example.com", Deno.env.get("VAPID_PUBLIC_KEY")!, Deno.env.get("VAPID_PRIVATE_KEY")!);

Deno.serve(async () => {
  // claim the due rows by deleting them first, so two overlapping runs never send the same alert twice
  const { data: due, error } = await sb.from("rest_timers").delete().lte("due_at", new Date().toISOString()).select("*");
  if (error) return new Response(error.message, { status: 500 });
  let sent = 0;
  for (const t of due ?? []) {
    const { data: sub } = await sb.from("push_subs").select("sub").eq("user_id", t.user_id).eq("endpoint", t.endpoint).maybeSingle();
    if (!sub) continue;
    try {
      await webpush.sendNotification(sub.sub, JSON.stringify({ title: "Rest over", body: t.body, url: "/", tag: "rest" }), { TTL: 60, urgency: "high" });
      sent++;
    } catch (e) {
      const code = (e as any)?.statusCode;
      if (code === 404 || code === 410) await sb.from("push_subs").delete().eq("user_id", t.user_id).eq("endpoint", t.endpoint);
      else console.error("rest push failed", code, (e as any)?.body);
    }
  }
  return new Response(JSON.stringify({ ok: true, sent }), { headers: { "Content-Type": "application/json" } });
});
