export type FormName = "freight-quote" | "contact" | "owner-operator";

export type SubmitResult = {
  success: boolean;
  message: string;
  referenceId?: string;
  /** Server-side validation messages, keyed by field name. */
  fieldErrors?: Record<string, string>;
};

/**
 * Every form posts to this app's own API, which revalidates with the same schema
 * the browser used, stores the submission, and sends it on with Resend.
 */
const ENDPOINTS: Record<FormName, string> = {
  contact: "/api/contact",
  "freight-quote": "/api/quote",
  "owner-operator": "/api/owner-operator",
};

const TIMEOUT_MS = 15_000;

const DELIVERY_FAILED =
  "We could not send your request. Please try again, or call dispatch so nothing is missed.";

function localReference(): string {
  return `ZWR-${Date.now().toString(36).toUpperCase()}`;
}

async function readBody(response: Response): Promise<Record<string, unknown> | null> {
  if (!response.headers.get("content-type")?.includes("application/json")) return null;
  try {
    const body: unknown = await response.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function submitForm(
  formName: FormName,
  payload: Record<string, unknown>,
): Promise<SubmitResult> {
  const endpoint = ENDPOINTS[formName];

  if (!endpoint) {
    console.error(
      `[submitForm] No endpoint configured for "${formName}"; the submission was not delivered.`,
    );
    return { success: false, message: DELIVERY_FAILED };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = await readBody(response);

    if (!response.ok) {
      console.error(
        `[submitForm] ${formName} failed: ${response.status} ${response.statusText}`,
      );
      return {
        success: false,
        message: typeof body?.message === "string" ? body.message : DELIVERY_FAILED,
        fieldErrors:
          body?.fieldErrors && typeof body.fieldErrors === "object"
            ? (body.fieldErrors as Record<string, string>)
            : undefined,
      };
    }

    const serverReference =
      typeof body?.referenceId === "string"
        ? body.referenceId
        : typeof body?.reference === "string"
          ? body.reference
          : undefined;

    return {
      success: true,
      message:
        typeof body?.message === "string"
          ? body.message
          : "Thanks — we've received your request and will respond within 2 business hours.",
      referenceId: serverReference ?? localReference(),
    };
  } catch (error) {
    console.error(`[submitForm] ${formName} could not reach the endpoint`, error);
    return { success: false, message: DELIVERY_FAILED };
  } finally {
    clearTimeout(timeout);
  }
}
