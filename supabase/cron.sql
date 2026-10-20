-- Runs the weigh-in reminder check every 5 minutes. The function only sends when it's a user's chosen time.
-- Replace PROJECT_REF and CRON_SECRET before running (setup script does this).
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.unschedule('weighin-push') where exists (select 1 from cron.job where jobname = 'weighin-push');
select cron.schedule('weighin-push', '*/5 * * * *', $$
  select net.http_post(
    url := 'https://PROJECT_REF.supabase.co/functions/v1/weighin-push',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','CRON_SECRET'),
    body := '{}'::jsonb
  );
$$);
