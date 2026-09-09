import { freightQuoteSchema } from "@/lib/schemas/freight-quote";
import { handleFormSubmission } from "@/lib/server/form-intake";
import { SERVICES } from "@/lib/data/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleFormSubmission({
    request,
    schema: freightQuoteSchema,
    formName: "freight-quote",
    summarise: (data) => {
      const service =
        SERVICES.find((s) => s.slug === data.serviceType)?.name ?? data.serviceType;
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
