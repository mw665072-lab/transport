import { describe, expect, it } from "vitest";
import {
  applicationSchema,
  applicationServerSchema,
  formatBytes,
} from "@/lib/schemas/application";

const valid = {
  jobSlug: "freight-dispatcher",
  name: "Sara Malik",
  email: "sara@example.com",
  phone: "+1 703 555 0199",
  cdlClass: "None" as const,
  yearsExperience: 4,
  linkedin: "",
  coverLetter: "Five years dispatching regional freight.",
  website: "",
};

describe("applicationSchema", () => {
  it("accepts a complete application", () => {
    expect(applicationSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a general application with no job slug", () => {
    expect(applicationSchema.safeParse({ ...valid, jobSlug: "" }).success).toBe(true);
  });

  it("does not block a filled honeypot in the browser", () => {
    // A password manager can autofill the trap. Blocking here would strand a
    // real customer on a form that silently refuses to submit.
    expect(applicationSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(
      true,
    );
  });

  it("carries the honeypot to the server without rejecting it", () => {
    // The route treats a filled trap as a silent accept, so validation must
    // pass it through rather than turn it into an error the customer sees.
    const result = applicationServerSchema.safeParse({ ...valid, website: "http://spam" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.website).toBe("http://spam");
  });

  it("requires a usable phone number", () => {
    expect(applicationSchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
    expect(applicationSchema.safeParse({ ...valid, phone: "abcdefg" }).success).toBe(false);
    expect(applicationSchema.safeParse({ ...valid, phone: "(703) 555-0199" }).success).toBe(
      true,
    );
  });

  it("rejects an invalid email with a friendly message", () => {
    const result = applicationSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
    }
  });

  it("rejects an unrealistic number of years", () => {
    expect(applicationSchema.safeParse({ ...valid, yearsExperience: 99 }).success).toBe(false);
    expect(applicationSchema.safeParse({ ...valid, yearsExperience: -1 }).success).toBe(false);
  });

  it("requires a full URL for the profile link when one is given", () => {
    expect(applicationSchema.safeParse({ ...valid, linkedin: "linkedin.com/x" }).success).toBe(
      false,
    );
    expect(
      applicationSchema.safeParse({ ...valid, linkedin: "https://linkedin.com/in/sara" })
        .success,
    ).toBe(true);
  });

  it("caps the cover letter length", () => {
    expect(
      applicationSchema.safeParse({ ...valid, coverLetter: "x".repeat(3001) }).success,
    ).toBe(false);
  });

  it("trims whitespace around the name", () => {
    const result = applicationSchema.safeParse({ ...valid, name: "  Sara Malik  " });
    expect(result.success && result.data.name).toBe("Sara Malik");
  });
});

describe("formatBytes", () => {
  it("renders readable sizes for the upload control", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
