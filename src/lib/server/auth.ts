import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-operator session for the admin panel. The password lives in
 * ADMIN_PASSWORD and never reaches the client; the cookie carries only a signed,
 * expiring token. If more than one operator ever needs access, replace this with
 * a real identity provider rather than adding more passwords here.
 */
const COOKIE = "zewar_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

function sign(value: string, key: string): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

/** Constant-time compare that will not throw on a length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

function makeToken(key: string): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(8).toString("hex");
  const body = `${expires}.${nonce}`;
  return `${body}.${sign(body, key)}`;
}

function tokenValid(token: string, key: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (!safeEqual(signature, sign(`${expires}.${nonce}`, key))) return false;
  const expiresAt = Number(expires);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export async function createSession(): Promise<void> {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const store = await cookies();
  store.set(COOKIE, makeToken(key), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  return Boolean(token && tokenValid(token, key));
}
