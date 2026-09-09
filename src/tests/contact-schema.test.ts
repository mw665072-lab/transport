import { describe, expect, it } from "vitest";
import { contactSchema, contactServerSchema } from "@/lib/schemas/contact";

const valid = {
  name: "Alex Rivera",
  email: "alex@example.com",
  phone: "",
  subject: "New Shipment" as const,
  message: "We have a pallet moving from Sacramento to Reno next Tuesday.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("does not block a filled honeypot in the browser", () => {
    // A password manager can autofill the trap. Blocking here would strand a
    // real customer on a form that silently refuses to submit.
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(true);
  });

  it("carries the honeypot to the server without rejecting it", () => {
    // The route treats a filled trap as a silent accept, so validation must
    // pass it through rather than turn it into an error the customer sees.
    const result = contactServerSchema.safeParse({ ...valid, website: "http://spam" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.website).toBe("http://spam");
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
    }
  });

  it("rejects a message that is too short", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });

  it("rejects a message over the maximum length", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success).toBe(
      false,
    );
  });

  it("allows an empty phone but rejects a malformed one", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "+1 916 841 8948" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
  });

  it("rejects a subject outside the allowed list", () => {
    expect(contactSchema.safeParse({ ...valid, subject: "Spam" }).success).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  Alex Rivera  " });
    expect(result.success && result.data.name).toBe("Alex Rivera");
  });
});
