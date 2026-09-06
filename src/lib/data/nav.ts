export type NavChild = {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
};

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly children?: readonly NavChild[];
};

export const NAV: readonly NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Box Truck Transportation", href: "/services/box-truck-transportation", description: "Enclosed regional freight & pallet moves" },
      { label: "Hotshot Services", href: "/services/hotshot-services", description: "Time-sensitive direct freight delivery" },
      { label: "Cargo Van Delivery", href: "/services/cargo-van-delivery", description: "Express parcels & smaller commercial cargo" },
      { label: "Sprinter Van Transportation", href: "/services/sprinter-van-transportation", description: "High-roof dedicated van transportation" },
      { label: "Freight Transportation", href: "/services/freight-transportation", description: "Interstate full & partial load moves" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Our operating mission & company history" },
      { label: "Coverage Area", href: "/coverage-area", description: "Operating states & regional corridors" },
      { label: "Equipment & Fleet", href: "/equipment", description: "Road-ready fleet specifications" },
      { label: "Experience & Authority", href: "/experience-authority", description: "MC, USDOT & carrier compliance" },
      { label: "Careers", href: "/career", description: "Join our driver & dispatch network" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
