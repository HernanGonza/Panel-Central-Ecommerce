import type { Customer } from "@/data/types";

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const customers: Customer[] = [
  {
    id: "gomez",
    name: "M. Gómez",
    storeIds: ["norte", "centro"],
    purchasesCount: 14,
    totalSpent: 482_300,
    lastPurchaseAt: daysAgo(2),
  },
  {
    id: "duarte",
    name: "J. Duarte",
    storeIds: ["centro"],
    purchasesCount: 6,
    totalSpent: 156_900,
    lastPurchaseAt: daysAgo(5),
  },
  {
    id: "acosta",
    name: "L. Acosta",
    storeIds: ["sur", "este"],
    purchasesCount: 9,
    totalSpent: 298_400,
    lastPurchaseAt: daysAgo(0),
  },
  {
    id: "farias",
    name: "R. Farías",
    storeIds: ["norte"],
    purchasesCount: 21,
    totalSpent: 710_200,
    lastPurchaseAt: daysAgo(1),
  },
  {
    id: "ibanez",
    name: "C. Ibáñez",
    storeIds: ["este"],
    purchasesCount: 3,
    totalSpent: 89_100,
    lastPurchaseAt: daysAgo(12),
  },
  {
    id: "sosa",
    name: "P. Sosa",
    storeIds: ["centro", "sur"],
    purchasesCount: 11,
    totalSpent: 334_600,
    lastPurchaseAt: daysAgo(3),
  },
];
