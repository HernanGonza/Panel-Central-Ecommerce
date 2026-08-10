import type { Customer } from "@/data/types";

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const customers: Customer[] = [
  {
    id: "gomez",
    name: "M. Gómez",
    email: "marina.gomez@gmail.com",
    phone: "+54 9 11 4512-3390",
    docId: "27.481.203",
    storeIds: ["norte", "centro"],
    purchasesCount: 14,
    totalSpent: 482_300,
    lastPurchaseAt: daysAgo(2),
  },
  {
    id: "duarte",
    name: "J. Duarte",
    email: "julian.duarte@hotmail.com",
    phone: "+54 9 11 3324-7710",
    docId: "30.112.884",
    storeIds: ["centro"],
    purchasesCount: 6,
    totalSpent: 156_900,
    lastPurchaseAt: daysAgo(5),
  },
  {
    id: "acosta",
    name: "L. Acosta",
    email: "lucia.acosta@gmail.com",
    phone: "+54 9 11 6650-2214",
    docId: "35.902.117",
    storeIds: ["sur", "este"],
    purchasesCount: 9,
    totalSpent: 298_400,
    lastPurchaseAt: daysAgo(0),
  },
  {
    id: "farias",
    name: "R. Farías",
    email: "rodrigo.farias@gmail.com",
    phone: "+54 9 11 5581-9034",
    docId: "28.774.502",
    storeIds: ["norte"],
    purchasesCount: 21,
    totalSpent: 710_200,
    lastPurchaseAt: daysAgo(1),
  },
  {
    id: "ibanez",
    name: "C. Ibáñez",
    email: "camila.ibanez@outlook.com",
    phone: "+54 9 11 4098-6621",
    docId: "38.220.945",
    storeIds: ["este"],
    purchasesCount: 3,
    totalSpent: 89_100,
    lastPurchaseAt: daysAgo(12),
  },
  {
    id: "sosa",
    name: "P. Sosa",
    email: "pablo.sosa@gmail.com",
    phone: "+54 9 11 2287-1150",
    docId: "31.665.789",
    storeIds: ["centro", "sur"],
    purchasesCount: 11,
    totalSpent: 334_600,
    lastPurchaseAt: daysAgo(3),
  },
];
