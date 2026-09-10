/**
 * Two-letter postal codes, used where a compact label is needed and the coverage
 * list comes from the database. Anything not in the map falls back to its first
 * two letters, so an admin can add a region we have not listed here.
 */
const US_STATE_ABBREVIATIONS: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  "district of columbia": "DC",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

export function stateAbbreviation(name: string): string {
  return (
    US_STATE_ABBREVIATIONS[name.trim().toLowerCase()] ?? name.trim().slice(0, 2).toUpperCase()
  );
}

/** "California, Texas and Nevada" — for prose that lists the coverage. */
export function listStates(states: string[], conjunction = "and"): string {
  if (states.length === 0) return "";
  if (states.length === 1) return states[0];
  return `${states.slice(0, -1).join(", ")} ${conjunction} ${states[states.length - 1]}`;
}
