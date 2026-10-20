// Called every 5 minutes by pg_cron. Sends the morning weigh-in reminder to each device at its chosen local time,
// once a day, and skips it if today's weight is already logged.
// Secrets: CRON_SECRET, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (e.g. mailto:you@example.com)
import { createClient } from "npm:@supabase/supabase-js@2.117.2";
import webpush from "npm:web-push@3.6.7";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@example.com", Deno.env.get("VAPID_PUBLIC_KEY")!, Deno.env.get("VAPID_PRIVATE_KEY")!);

function localParts(tz: string) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, mins: Number(p.hour) * 60 + Number(p.minute) };
}
function avg7(entries: { d: string; kg: number }[], today: string) {
  const end = new Date(today + "T12:00:00Z").getTime();
  const v = entries.filter((e) => !(e as any).s).filter((e) => { const dd = (end - new Date(e.d + "T12:00:00Z").getTime()) / 864e5; return dd >= 1 && dd < 8; }).map((e) => e.kg);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return new Response("forbidden", { status: 403 });
  const opts = await req.json().catch(() => ({}));
  const { data: subs, error } = await sb.from("push_subs").select("*");
  if (opts.test) {
    // Manual test: send one notification to every device now, without touching the daily schedule.
    let ok = 0;
    for (const s of subs ?? []) { try { await webpush.sendNotification(s.sub, JSON.stringify({ title: "AJ Training", body: "Notifications are working. Your weigh-in reminder comes at " + s.remind_at + ".", url: "/", tag: "test" })); ok++; } catch (e) { console.error("test push failed", (e as any)?.statusCode, (e as any)?.body); } }
    return new Response(JSON.stringify({ ok: true, test: true, sent: ok, devices: subs?.length ?? 0 }), { headers: { "Content-Type": "application/json" } });
  }
  if (error) return new Response(error.message, { status: 500 });
  let sent = 0;
  for (const s of subs ?? []) {
    const { date, mins } = localParts(s.tz || "Europe/London");
    const [h, m] = String(s.remind_at || "07:00").split(":").map(Number);
    const due = h * 60 + m;
    if (s.last_sent === date || mins < due || mins > due + 90) continue;
    const { data: bw } = await sb.from("docs").select("data").eq("user_id", s.user_id).eq("path", "state/bodyweight").maybeSingle();
    const entries = (bw?.data?.entries ?? []) as { d: string; kg: number }[];
    if (entries.some((e) => e.d === date && !(e as any).s)) { await sb.from("push_subs").update({ last_sent: date }).eq("user_id", s.user_id).eq("endpoint", s.endpoint); continue; }
    const a = avg7(entries, date);
    const body = `Weigh in before you eat or drink, then log it.${a ? ` 7-day average ${a.toFixed(1)} kg.` : ""}`;
    try {
      await webpush.sendNotification(s.sub, JSON.stringify({ title: "Morning AJ", body, url: "/#weigh", tag: "weighin" }));
      sent++;
    } catch (e) {
      const code = (e as any)?.statusCode;
      if (code === 404 || code === 410) { await sb.from("push_subs").delete().eq("user_id", s.user_id).eq("endpoint", s.endpoint); continue; }
      console.error("push failed", code, (e as any)?.body);
    }
    await sb.from("push_subs").update({ last_sent: date }).eq("user_id", s.user_id).eq("endpoint", s.endpoint);
  }
  return new Response(JSON.stringify({ ok: true, sent }), { headers: { "Content-Type": "application/json" } });
});
