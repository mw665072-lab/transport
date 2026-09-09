/**
 * Minimal .env.local reader for the seed and migration scripts.
 *
 * Values are read as-is, so an unquoted value containing characters a shell
 * would choke on (an email in angle brackets, for example) still loads.
 */
import { readFileSync, existsSync } from "node:fs";

export function loadEnv(file = ".env.local") {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    // A value already in the real environment wins, matching Next.js.
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
