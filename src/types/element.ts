export interface ChemicalElement {
  name: string;
  symbol: string;
  atomicNumber: number;
  family: string;
  physicalState: string;
  discoveryYear: number;
}

export interface GuessResult {
  property: string;
  status: "correct" | "partial" | "wrong";
  direction?: "higher" | "lower";
}
