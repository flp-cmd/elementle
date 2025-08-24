import { ChemicalElement } from "@/types/element";

export const elements: ChemicalElement[] = [
  {
    name: "ferro",
    symbol: "Fe",
    atomicNumber: 26,
    family: "metal",
    physicalState: "solid",
    discoveryYear: -3000,
  },
  {
    name: "ouro",
    symbol: "Au",
    atomicNumber: 79,
    family: "metal",
    physicalState: "solid",
    discoveryYear: -2600,
  },
  {
    name: "oxigenio",
    symbol: "O",
    atomicNumber: 8,
    family: "non-metal",
    physicalState: "gas",
    discoveryYear: 1774,
  },
  {
    name: "helio",
    symbol: "He",
    atomicNumber: 2,
    family: "noble-gas",
    physicalState: "gas",
    discoveryYear: 1895,
  },
  {
    name: "carbono",
    symbol: "C",
    atomicNumber: 6,
    family: "non-metal",
    physicalState: "solid",
    discoveryYear: -3750,
  },
  {
    name: "hidrogenio",
    symbol: "H",
    atomicNumber: 1,
    family: "non-metal",
    physicalState: "gas",
    discoveryYear: 1766,
  },
  {
    name: "sodio",
    symbol: "Na",
    atomicNumber: 11,
    family: "metal",
    physicalState: "solid",
    discoveryYear: 1807,
  },
  {
    name: "cloro",
    symbol: "Cl",
    atomicNumber: 17,
    family: "halogen",
    physicalState: "gas",
    discoveryYear: 1774,
  },
  {
    name: "mercurio",
    symbol: "Hg",
    atomicNumber: 80,
    family: "metal",
    physicalState: "liquid",
    discoveryYear: -1500,
  },
  {
    name: "bromo",
    symbol: "Br",
    atomicNumber: 35,
    family: "halogen",
    physicalState: "liquid",
    discoveryYear: 1826,
  },
];

export function getRandomElement(): ChemicalElement {
  return elements[Math.floor(Math.random() * elements.length)];
}

export function findElementByName(name: string): ChemicalElement | undefined {
  return elements.find(
    (element) => element.name.toLowerCase() === name.toLowerCase()
  );
}
