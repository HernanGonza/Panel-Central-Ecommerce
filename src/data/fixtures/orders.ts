import type { Order, OrderItem } from "@/data/types";
import { customers } from "@/data/fixtures/customers";
import { products } from "@/data/fixtures/products";

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

function buildItems(lines: { productId: string; quantity: number }[]): OrderItem[] {
  return lines.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error(`Producto ${productId} no encontrado en fixtures`);
    return { productId, productName: product.name, quantity, unitPrice: product.price };
  });
}

function order(
  id: string,
  storeId: string,
  customerId: string,
  status: Order["status"],
  ago: number,
  lines: { productId: string; quantity: number }[],
): Order {
  const items = buildItems(lines);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return {
    id,
    storeId,
    customerId,
    customerName: customerName(customerId),
    status,
    items,
    total,
    createdAt: daysAgo(ago),
    sellerId: nextSellerId(storeId),
  };
}

export const orders: Order[] = [
  // Tienda Norte — p1 Campera de jean oversize, p4 Zapatillas urbanas, p8 Zapatillas running
  order("#4821", "norte", "gomez", "entregado", 2, [{ productId: "p1", quantity: 1 }]),
  order("#4824", "norte", "farias", "enviado", 1, [{ productId: "p4", quantity: 1 }]),
  order("#4827", "norte", "gomez", "enviado", 4, [
    { productId: "p1", quantity: 1 },
    { productId: "p8", quantity: 1 },
  ]),
  order("#4831", "norte", "farias", "entregado", 8, [
    { productId: "p4", quantity: 1 },
    { productId: "p1", quantity: 1 },
  ]),
  order("#4835", "norte", "sosa", "entregado", 9, [{ productId: "p8", quantity: 2 }]),
  order("#4838", "norte", "acosta", "enviado", 2, [{ productId: "p4", quantity: 1 }]),
  order("#4842", "norte", "duarte", "pendiente", 0, [{ productId: "p1", quantity: 1 }]),
  order("#4846", "norte", "ibanez", "entregado", 15, [
    { productId: "p8", quantity: 1 },
    { productId: "p4", quantity: 1 },
  ]),

  // Tienda Centro — p2 Remera básica algodón, p6 Buzo canguro friza, p9 Buzo oversize gris
  order("#4822", "centro", "duarte", "preparando", 1, [{ productId: "p2", quantity: 1 }]),
  order("#4826", "centro", "sosa", "pendiente", 0, [{ productId: "p6", quantity: 1 }]),
  order("#4829", "centro", "duarte", "entregado", 7, [{ productId: "p2", quantity: 2 }]),
  order("#4833", "centro", "gomez", "pendiente", 0, [{ productId: "p9", quantity: 1 }]),
  order("#4836", "centro", "farias", "entregado", 10, [
    { productId: "p6", quantity: 1 },
    { productId: "p2", quantity: 1 },
  ]),
  order("#4840", "centro", "ibanez", "preparando", 1, [{ productId: "p2", quantity: 1 }]),
  order("#4843", "centro", "acosta", "enviado", 4, [{ productId: "p9", quantity: 1 }]),

  // Tienda Sur — p3 Jean recto tiro alto, p7 Campera impermeable
  order("#4823", "sur", "acosta", "pendiente", 0, [{ productId: "p3", quantity: 1 }]),
  order("#4828", "sur", "sosa", "entregado", 6, [{ productId: "p3", quantity: 1 }]),
  order("#4832", "sur", "acosta", "enviado", 3, [{ productId: "p7", quantity: 1 }]),
  order("#4837", "sur", "duarte", "pendiente", 0, [{ productId: "p3", quantity: 1 }]),
  order("#4841", "sur", "farias", "entregado", 13, [
    { productId: "p7", quantity: 1 },
    { productId: "p3", quantity: 1 },
  ]),
  order("#4845", "sur", "gomez", "preparando", 2, [{ productId: "p3", quantity: 2 }]),

  // Tienda Este — p5 Vestido midi estampado
  order("#4825", "este", "ibanez", "entregado", 3, [{ productId: "p5", quantity: 1 }]),
  order("#4830", "este", "acosta", "preparando", 2, [{ productId: "p5", quantity: 1 }]),
  order("#4834", "este", "ibanez", "preparando", 1, [{ productId: "p5", quantity: 2 }]),
  order("#4839", "este", "gomez", "entregado", 11, [{ productId: "p5", quantity: 1 }]),
  order("#4844", "este", "sosa", "entregado", 14, [{ productId: "p5", quantity: 2 }]),
];
