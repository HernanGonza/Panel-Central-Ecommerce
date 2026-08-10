import type { Order } from "@/data/types";
import { customers } from "@/data/fixtures/customers";

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function customerName(id: string): string {
  return customers.find((c) => c.id === id)?.name ?? id;
}

/** Vendedores/gerentes que cargan ventas en cada tienda (ver fixtures/users.ts). */
const STORE_SELLERS: Record<string, string[]> = {
  norte: ["mdiaz", "nvera"],
  centro: ["jrohm"],
  sur: ["frios"],
  este: ["smolina"],
};
const sellerCounters: Record<string, number> = {};

function nextSellerId(storeId: string): string | undefined {
  const sellers = STORE_SELLERS[storeId] ?? [];
  if (sellers.length === 0) return undefined;
  const count = sellerCounters[storeId] ?? 0;
  sellerCounters[storeId] = count + 1;
  return sellers[count % sellers.length];
}

function order(
  id: string,
  storeId: string,
  customerId: string,
  status: Order["status"],
  total: number,
  ago: number,
): Order {
  return {
    id,
    storeId,
    customerId,
    customerName: customerName(customerId),
    status,
    total,
    createdAt: daysAgo(ago),
    sellerId: nextSellerId(storeId),
  };
}

export const orders: Order[] = [
  order("#4821", "norte", "gomez", "entregado", 38_900, 2),
  order("#4822", "centro", "duarte", "preparando", 9_500, 1),
  order("#4823", "sur", "acosta", "pendiente", 27_300, 0),
  order("#4824", "norte", "farias", "enviado", 52_000, 1),
  order("#4825", "este", "ibanez", "entregado", 31_400, 3),
  order("#4826", "centro", "sosa", "pendiente", 22_800, 0),
  order("#4827", "norte", "gomez", "enviado", 45_200, 4),
  order("#4828", "sur", "sosa", "entregado", 18_700, 6),
  order("#4829", "centro", "duarte", "entregado", 12_300, 7),
  order("#4830", "este", "acosta", "preparando", 29_800, 2),
  order("#4831", "norte", "farias", "entregado", 61_000, 8),
  order("#4832", "sur", "acosta", "enviado", 33_900, 3),
  order("#4833", "centro", "gomez", "pendiente", 15_400, 0),
  order("#4834", "este", "ibanez", "preparando", 27_600, 1),
  order("#4835", "norte", "sosa", "entregado", 42_100, 9),
  order("#4836", "centro", "farias", "entregado", 19_900, 10),
  order("#4837", "sur", "duarte", "pendiente", 24_500, 0),
  order("#4838", "norte", "acosta", "enviado", 55_300, 2),
  order("#4839", "este", "gomez", "entregado", 21_000, 11),
  order("#4840", "centro", "ibanez", "preparando", 16_800, 1),
  order("#4841", "sur", "farias", "entregado", 37_200, 13),
  order("#4842", "norte", "duarte", "pendiente", 29_900, 0),
  order("#4843", "centro", "acosta", "enviado", 20_400, 4),
  order("#4844", "este", "sosa", "entregado", 33_100, 14),
  order("#4845", "sur", "gomez", "preparando", 26_700, 2),
  order("#4846", "norte", "ibanez", "entregado", 48_900, 15),
];
