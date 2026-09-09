import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

async function loadSubmit(endpoint?: string) {
  vi.resetModules();
  if (endpoint) process.env.NEXT_PUBLIC_FORM_ENDPOINT = endpoint;
  else delete process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  return (await import("@/lib/forms/submit")).submitForm;
}

describe("submitForm", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  });

  it("routes every form to this app's own API", async () => {
    const submitForm = await loadSubmit();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    await submitForm("contact", { name: "Alex", website: "" });
    await submitForm("freight-quote", { fullName: "Alex", website: "" });
    await submitForm("owner-operator", { fullName: "Alex", website: "" });

    expect(fetchSpy.mock.calls.map((call) => call[0])).toEqual([
      "/api/contact",
      "/api/quote",
      "/api/owner-operator",
    ]);
  });

  it("keeps the honeypot, which our API needs for its spam checks", async () => {
    const submitForm = await loadSubmit();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    await submitForm("contact", { name: "Alex", website: "" });

    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toHaveProperty("website", "");
  });

  it("surfaces server-side field errors so the form can highlight them", async () => {
    const submitForm = await loadSubmit();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Check the fields.",
          fieldErrors: { email: "Enter a valid email address" },
        }),
        {
          status: 422,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const result = await submitForm("contact", { name: "Alex" });

    expect(result.success).toBe(false);
    expect(result.fieldErrors).toEqual({ email: "Enter a valid email address" });
  });

  it("uses the reference id returned by the endpoint", async () => {
    const submitForm = await loadSubmit();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ referenceId: "SRV-9001" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    expect((await submitForm("freight-quote", {})).referenceId).toBe("SRV-9001");
  });

  it("reports failure on a non-2xx response", async () => {
    const submitForm = await loadSubmit();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));

    const result = await submitForm("freight-quote", {});

    expect(result.success).toBe(false);
    expect(result.referenceId).toBeUndefined();
  });

  it("reports failure when the request throws", async () => {
    const submitForm = await loadSubmit();
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    expect((await submitForm("owner-operator", {})).success).toBe(false);
  });
});
