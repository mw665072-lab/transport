import { describe, expect, it, beforeEach } from "vitest";
import { checkRateLimit, __resetRateLimit } from "@/lib/server/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("allows the first five requests in a window", () => {
    for (let i = 0; i < 5; i++) expect(checkRateLimit("ip").allowed).toBe(true);
  });

  it("blocks the sixth and reports when to retry", () => {
    for (let i = 0; i < 5; i++) checkRateLimit("ip");
    const blocked = checkRateLimit("ip");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps separate counters per key", () => {
    for (let i = 0; i < 5; i++) checkRateLimit("a");
    expect(checkRateLimit("a").allowed).toBe(false);
    expect(checkRateLimit("b").allowed).toBe(true);
  });

  it("opens a fresh window once the old one expires", () => {
    const start = Date.now();
    for (let i = 0; i < 5; i++) checkRateLimit("ip", start);
    expect(checkRateLimit("ip", start).allowed).toBe(false);
    expect(checkRateLimit("ip", start + 60 * 60 * 1000 + 1).allowed).toBe(true);
  });
});
