import { listStates } from "@/lib/data/us-states";
import { COMPANY } from "@/lib/data/company";

export type FaqEntry = { question: string; answer: string };

/**
 * The equipment and coverage answers are built from live data so they cannot
 * contradict the fleet and coverage the admin panel publishes.
 */
export function buildFreightFaq(states: string[], equipmentNames: string[]): FaqEntry[] {
  return [
    {
      question: "What information do you need for a freight quote?",
      answer:
        "Pickup and delivery locations, pickup date, freight type, commodity, dimensions when available, weight when known, and the best contact details.",
    },
    {
      question: `Which equipment does ${COMPANY.shortName} use?`,
      answer: `${COMPANY.shortName} focuses on ${listStates(equipmentNames)}. The assigned equipment is confirmed against each shipment.`,
    },
    {
      question: `Where does ${COMPANY.shortName} operate?`,
      answer: `Current stated coverage includes ${listStates(
        states,
      )}, plus surrounding interstate regions based on lane and driver availability.`,
    },
    {
      question: "How quickly will I receive a response?",
      answer:
        "The quote page targets a response within 2 business hours. Actual dispatch timing depends on lane, equipment, freight readiness, and availability.",
    },
    {
      question: "Can I request an expedited shipment?",
      answer:
        "Yes. Use the quote notes to explain the required pickup and delivery timing. Dispatch will confirm whether suitable equipment and a driver are available.",
    },
  ];
}
