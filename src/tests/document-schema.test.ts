import { describe, expect, it } from "vitest";
import {
  documentSchema,
  documentServerSchema,
  DOC_MAX_BYTES,
  DOC_EXTENSIONS,
} from "@/lib/schemas/document";

const valid = {
  reference: "ZWR-80ACE483",
  company: "Cole Supply",
  contact: "Dana Cole",
  email: "dana@example.com",
  phone: "+1 916 555 0134",
  note: "Signed BOL for the Reno run.",
  website: "",
};

describe("documentSchema", () => {
  it("accepts a complete upload", () => {
    expect(documentSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a load reference so dispatch can match it", () => {
    expect(documentSchema.safeParse({ ...valid, reference: "" }).success).toBe(false);
  });

  it("does not block a filled honeypot in the browser", () => {
    // A password manager can autofill the trap. Blocking here would strand a
    // real customer on a form that silently refuses to submit.
    expect(documentSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(true);
  });

  it("carries the honeypot to the server without rejecting it", () => {
    // The route treats a filled trap as a silent accept, so validation must
    // pass it through rather than turn it into an error the customer sees.
    const result = documentServerSchema.safeParse({ ...valid, website: "http://spam" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.website).toBe("http://spam");
  });

  it("rejects an invalid email", () => {
    const result = documentSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
  });

  it("allows an empty phone but rejects a malformed one", () => {
    expect(documentSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
    expect(documentSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
  });
});

describe("document upload limits", () => {
  it("caps uploads at 10 MB", () => {
    expect(DOC_MAX_BYTES).toBe(10 * 1024 * 1024);
  });

  it("allows only PDFs and photos, never executables", () => {
    expect([...DOC_EXTENSIONS]).toEqual([".pdf", ".jpg", ".jpeg", ".png", ".heic"]);
    expect(DOC_EXTENSIONS).not.toContain(".exe");
  });
});
