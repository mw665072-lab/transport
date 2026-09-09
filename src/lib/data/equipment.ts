export type Equipment = {
  name: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
};

// Payload and dimensions are deliberately not published as fixed figures: they vary
// by the exact unit assigned, and quoting a number the assigned vehicle cannot meet
// creates a compliance and liability problem. Dispatch confirms them per shipment.
const CONFIRMED_AT_DISPATCH = "Confirmed against your freight before dispatch";

export const EQUIPMENT: Equipment[] = [
  {
    name: "Cargo Vans",
    image: "/images/cargo-van.jpg",
    description:
      "Enclosed, direct-delivery capacity for smaller commercial freight and urgent shipments.",
    specs: [
      { label: "Payload", value: CONFIRMED_AT_DISPATCH },
      { label: "Cargo length", value: CONFIRMED_AT_DISPATCH },
      { label: "Liftgate", value: "Not typical; confirmed per assigned vehicle" },
    ],
  },
  {
    name: "Sprinter Vans",
    image: "/images/sprinter-van.jpg",
    description:
      "Higher-roof enclosed vans for dedicated business freight needing more usable cargo space.",
    specs: [
      { label: "Payload", value: CONFIRMED_AT_DISPATCH },
      { label: "Cargo length", value: CONFIRMED_AT_DISPATCH },
      { label: "Liftgate", value: "Confirmed per assigned vehicle" },
    ],
  },
  {
    name: "Box Trucks",
    image: "/images/box-truck.jpg",
    description:
      "Road-ready enclosed trucks for palletized and commercial regional/interstate freight.",
    specs: [
      { label: "Payload", value: CONFIRMED_AT_DISPATCH },
      { label: "Deck length", value: CONFIRMED_AT_DISPATCH },
      { label: "Liftgate", value: "Available only when confirmed at dispatch" },
    ],
  },
];
export const FLEET_DESCRIPTION =
  "Well-maintained and road-ready fleet for regional and interstate operations.";
export const SPEC_NOTE =
  "Capacity varies by the exact unit assigned to your load. Dispatch confirms legal payload, usable cargo dimensions, and loading method during quoting rather than publishing a single figure that may not apply.";
