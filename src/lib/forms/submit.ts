export type SubmitResult = { success: boolean; message: string; referenceId?: string };
export async function submitForm(formName: "freight-quote" | "contact" | "owner-operator", payload: Record<string, unknown>): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const mockFail = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mockFail") === "1";
  if (process.env.NODE_ENV !== "production") console.log(`[mock submit] ${formName}`, payload);
  if (mockFail) return { success: false, message: "We could not receive the request. Please try again or call dispatch." };
  return { success: true, message: "Thanks — we've received your request and will respond within 2 business hours.", referenceId: "ZWR-" + Date.now().toString(36).toUpperCase() };
}
