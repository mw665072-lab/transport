import { ownerOperatorServerSchema } from "@/lib/schemas/owner-operator";
import { handleFormSubmission } from "@/lib/server/form-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleFormSubmission({
    request,
    schema: ownerOperatorServerSchema,
    formName: "owner-operator",
    summarise: (data) => ({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: `Owner operator: ${data.equipmentType}`,
      message: [
        `Equipment: ${data.equipmentType}`,
        `CDL class: ${data.cdlClass}`,
        `Experience: ${data.yearsExperience} year(s)`,
        `Availability: ${data.availability}`,
        data.mcNumber ? `MC number: ${data.mcNumber}` : null,
        data.preferredLanes ? `Preferred lanes: ${data.preferredLanes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });
}
