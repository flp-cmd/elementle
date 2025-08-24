export interface ChemicalElement {
  name: string;
  symbol: string;
  atomic_number: number;
  group_name: string;
  state_ntp: string;
  discovery_year: number | string;
  applications: string;
  trivia: string[];
}

export interface GuessResult {
  property: string;
  status: "correct" | "partial" | "wrong";
  direction?: "higher" | "lower";
}
