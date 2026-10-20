// Generates the key pair for push notifications. Run: npx -y web-push@3.6.7 generate-vapid-keys --json
// (kept as a script so the setup steps are in one place)
import { execSync } from "node:child_process";
console.log(execSync("npx -y web-push@3.6.7 generate-vapid-keys --json").toString());
