export interface AssetData {
  id: number;
  name: string;
  partno: string;
  vendor: string;
  category: string;
  count: number;
  location: string;
}

export const rows: AssetData[] = [
  {
    id: 12435,
    name: "10Gb Optics",
    partno: "124-56xd",
    vendor: "Uber",
    category: "Light Optics",
    count: 9,
    location: "Charlotte",
  },
  {
    id: 12531,
    name: "8Gb HD",
    partno: "124-56xd",
    vendor: "Dragon",
    category: "Hard Drives",
    count: 100,
    location: "Charlotte",
  },
  {
    id: 15423,
    name: "Audiophile Headphones",
    partno: "6XX",
    vendor: "Sennheiser",
    category: "Headphone",
    count: 1,
    location: "Charlotte",
  },
  {
    id: 12431,
    name: "Micromix",
    partno: "123-45",
    vendor: "Behringer",
    category: "Mixers",
    count: 2,
    location: "Charlotte",
  },
];
