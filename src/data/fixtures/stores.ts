import type { Store } from "@/data/types";

export const stores: Store[] = [
  {
    id: "norte",
    name: "Tienda Norte",
    zone: "Ciudad Capital · Centro",
    status: "activa",
    monthlySales: 14_200_000,
    stockUnits: 3240,
    ordersCount: 412,
  },
  {
    id: "centro",
    name: "Tienda Centro",
    zone: "Zona Centro",
    status: "activa",
    monthlySales: 11_800_000,
    stockUnits: 2860,
    ordersCount: 356,
  },
  {
    id: "sur",
    name: "Tienda Sur",
    zone: "Barrio Sur",
    status: "activa",
    monthlySales: 9_600_000,
    stockUnits: 2120,
    ordersCount: 289,
  },
  {
    id: "este",
    name: "Tienda Este",
    zone: "Zona Este",
    status: "en_incorporacion",
    monthlySales: 4_100_000,
    stockUnits: 1940,
    ordersCount: 118,
  },
];
