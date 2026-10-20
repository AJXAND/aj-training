/* Public settings for the app. These are safe to publish: the anon key only works through the database's
   security rules, which limit every user to their own data. Secret keys live in Supabase, never here. */
window.AJ_CONFIG = {
  supabaseUrl: "https://znbotkcmhyssnzpukegd.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYm90a2NtaHlzc256cHVrZWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NjkyMjQsImV4cCI6MjEwODA0NTIyNH0.9VR29aWKafPkdPvrOe5gBE35heLZT_fRGR9ZmXcNPM4",
  vapidPublicKey: "BNmAbmqV6ZpfR3905s5-bwFCvBPnSrgJujFvYK5Ljsz-caNNuFh1m_RbPte8TGITz4cnmEmkSbUIBbrG4FemFdw"
};
