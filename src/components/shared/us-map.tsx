export function UsMap() {
  return (
    <svg
      viewBox="0 0 700 430"
      role="img"
      aria-label="Stylized United States coverage map highlighting California, Nevada, Texas, and Virginia"
      className="h-auto w-full"
    >
      <rect x="0" y="0" width="700" height="430" rx="28" fill="#F7F9FC" />
      <path
        d="M92 108 155 76l91 20 77-24 79 23 61-17 61 36 80 7 22 54-31 44 16 52-55 16-31 37-89-10-40 39-76-18-66 22-41-43-61-10-33-59 17-57-24-40z"
        fill="#D7E0EE"
        stroke="#081A43"
        strokeWidth="5"
      />
      <g fill="#F5A524">
        <circle cx="110" cy="210" r="16" />
        <circle cx="153" cy="199" r="16" />
        <circle cx="337" cy="310" r="16" />
        <circle cx="532" cy="231" r="16" />
      </g>
      <g fill="#081A43" fontSize="20" fontWeight="700">
        <text x="82" y="247">
          CA
        </text>
        <text x="138" y="176">
          NV
        </text>
        <text x="317" y="348">
          TX
        </text>
        <text x="520" y="207">
          VA
        </text>
      </g>
    </svg>
  );
}
