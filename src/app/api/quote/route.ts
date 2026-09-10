import { freightQuoteServerSchema } from "@/lib/schemas/freight-quote";
import { handleFormSubmission } from "@/lib/server/form-intake";
import { getServices } from "@/lib/server/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleFormSubmission({
    request,
    schema: freightQuoteServerSchema,
    formName: "freight-quote",
    summarise: async (data) => {
      // The service list is editable, so the label is resolved when the quote
      // arrives rather than validated against a list frozen at build time.
      const services = await getServices();
      const service =
        services.find((s) => s.slug === data.serviceType)?.name ?? data.serviceType;
      return {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: `Quote: ${data.pickupCity}, ${data.pickupState} to ${data.deliveryCity}, ${data.deliveryState}`,
        message: [
          `Service: ${service}`,
          `Pickup date: ${data.pickupDate}`,
          `Commodity: ${data.commodity}`,
          data.weightLbs ? `Weight: ${data.weightLbs} lb` : null,
          data.dimensions ? `Dimensions: ${data.dimensions}` : null,
          data.notes ? `\nNotes:\n${data.notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      };
    },
  });
}
