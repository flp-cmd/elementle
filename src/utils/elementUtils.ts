import { ChemicalElement, GuessResult } from "@/types/element";

// Pure function to compare two elements
export const compareElements = (
  guessedElement: ChemicalElement,
  target: ChemicalElement
): GuessResult[] => {
  const results: GuessResult[] = [];

  // Group comparison
  results.push({
    property: "group_name",
    status:
      guessedElement.group_name === target.group_name ? "correct" : "wrong",
  });

  // Physical state comparison
  results.push({
    property: "state_ntp",
    status: guessedElement.state_ntp === target.state_ntp ? "correct" : "wrong",
  });

  // Atomic number comparison
  if (guessedElement.atomic_number === target.atomic_number) {
    results.push({
      property: "atomic_number",
      status: "correct",
    });
  } else {
    results.push({
      property: "atomic_number",
      status: "wrong",
      direction:
        guessedElement.atomic_number < target.atomic_number
          ? "higher"
          : "lower",
    });
  }

  // Discovery year comparison
  const guessYear =
    typeof guessedElement.discovery_year === "string"
      ? parseInt(guessedElement.discovery_year) || 0
      : guessedElement.discovery_year;
  const targetYear =
    typeof target.discovery_year === "string"
      ? parseInt(target.discovery_year) || 0
      : target.discovery_year;

  if (guessYear === targetYear) {
    results.push({
      property: "discovery_year",
      status: "correct",
    });
  } else {
    results.push({
      property: "discovery_year",
      status: "wrong",
      direction: guessYear < targetYear ? "higher" : "lower",
    });
  }

  return results;
};
