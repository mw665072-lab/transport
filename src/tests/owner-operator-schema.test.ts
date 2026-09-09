import { describe, expect, it } from "vitest";
import { ownerOperatorSchema } from "@/lib/schemas/owner-operator";

const valid = {
  fullName: "Marcus Reed",
  email: "marcus@example.com",
  phone: "+1 703 555 0188",
  cdlClass: "Class A" as const,
  yearsExperience: 6,
  equipmentType: "Box Truck" as const,
  mcNumber: "MC-123456",
  preferredLanes: "VA to NC",
  availability: "Immediately" as const,
  website: "",
};

describe("ownerOperatorSchema", () => {
  it("accepts a complete enquiry", () => {
    expect(ownerOperatorSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a filled honeypot", () => {
    expect(ownerOperatorSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });

  it("requires a usable phone number", () => {
    expect(ownerOperatorSchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
    expect(ownerOperatorSchema.safeParse({ ...valid, phone: "abcdefg" }).success).toBe(false);
    expect(ownerOperatorSchema.safeParse({ ...valid, phone: "(703) 555-0188" }).success).toBe(
      true,
    );
  });

  it("rejects an unrealistic number of years", () => {
    expect(ownerOperatorSchema.safeParse({ ...valid, yearsExperience: 99 }).success).toBe(
      false,
    );
  });

  it("rejects equipment outside the allowed list", () => {
    expect(
      ownerOperatorSchema.safeParse({ ...valid, equipmentType: "Aeroplane" }).success,
    ).toBe(false);
  });

  it("allows optional fields to be blank", () => {
    expect(
      ownerOperatorSchema.safeParse({ ...valid, mcNumber: "", preferredLanes: "" }).success,
    ).toBe(true);
  });
});
