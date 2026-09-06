export type Equipment = { name: string; image: string; description: string; specs: { label: string; value: string }[] };
export const EQUIPMENT: Equipment[] = [
  { name: "Cargo Vans", image: "/images/cargo-van.jpg", description: "Enclosed, direct-delivery capacity for smaller commercial freight and urgent shipments.", specs: [
    { label: "Approx. payload", value: "TODO: confirm fleet-specific payload" },
    { label: "Cargo length", value: "TODO: confirm fleet dimensions" },
    { label: "Liftgate", value: "Not typical; confirm assigned vehicle" },
  ]},
  { name: "Sprinter Vans", image: "/images/sprinter-van.jpg", description: "Higher-roof enclosed vans for dedicated business freight needing more usable cargo space.", specs: [
    { label: "Approx. payload", value: "TODO: confirm fleet-specific payload" },
    { label: "Cargo length", value: "TODO: confirm fleet dimensions" },
    { label: "Liftgate", value: "Confirm assigned vehicle" },
  ]},
  { name: "Box Trucks", image: "/images/box-truck.jpg", description: "Road-ready enclosed trucks for palletized and commercial regional/interstate freight.", specs: [
    { label: "Approx. payload", value: "TODO: confirm fleet-specific payload" },
    { label: "Deck length", value: "TODO: confirm fleet dimensions" },
    { label: "Liftgate", value: "Available only when confirmed at dispatch" },
  ]},
];
export const FLEET_DESCRIPTION = "Well-maintained and road-ready fleet for regional and interstate operations.";
