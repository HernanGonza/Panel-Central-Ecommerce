import type { Invoice } from "@/data/types";

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const invoices: Invoice[] = [
  { id: "FC-1042", storeId: "norte", amount: 38_900, status: "pagado", method: "mercado_pago", date: daysAgo(2) },
  { id: "FC-1041", storeId: "centro", amount: 9_500, status: "pendiente", method: "transferencia", date: daysAgo(1) },
  { id: "FC-1040", storeId: "sur", amount: 27_300, status: "pagado", method: "tarjeta", date: daysAgo(0) },
  { id: "FC-1039", storeId: "este", amount: 31_400, status: "pagado", method: "mercado_pago", date: daysAgo(3) },
  { id: "FC-1038", storeId: "norte", amount: 52_000, status: "pendiente", method: "efectivo_local", date: daysAgo(4) },
];

export const paymentMethodStats = [
  { method: "mercado_pago", pct: 42 },
  { method: "transferencia", pct: 24 },
  { method: "tarjeta", pct: 22 },
  { method: "efectivo_local", pct: 12 },
] as const;
