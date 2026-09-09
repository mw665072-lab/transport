import { describe, expect, it } from "vitest";
import { SOCIAL_KEYS, isPublishableUrl } from "@/lib/data/social";

describe("social link configuration", () => {
  it("covers the platforms the settings form offers", () => {
    expect(SOCIAL_KEYS.map((s) => s.key)).toEqual([
      "social_facebook",
      "social_linkedin",
      "social_x",
      "social_instagram",
      "social_youtube",
    ]);
  });

  it("gives every platform a label for the accessible link name", () => {
    for (const entry of SOCIAL_KEYS) {
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });
});

describe("social link validation", () => {
  it("accepts full URLs", () => {
    expect(isPublishableUrl("https://www.facebook.com/zewartransport")).toBe(true);
    expect(isPublishableUrl("http://linkedin.com/company/x")).toBe(true);
  });

  it("rejects blanks and bare domains, so no dead icon is rendered", () => {
    expect(isPublishableUrl("")).toBe(false);
    expect(isPublishableUrl("   ")).toBe(false);
    expect(isPublishableUrl("facebook.com/zewar")).toBe(false);
    expect(isPublishableUrl("www.facebook.com")).toBe(false);
    expect(isPublishableUrl("javascript:alert(1)")).toBe(false);
  });
});
