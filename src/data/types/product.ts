export interface Product {
  id: string;
  name: string;
  category: string;
  storeId: string;
  price: number;
  /** Costo de reposición — insumo para calcular margen. */
  cost: number;
  stock: number;
  /** Unidades vendidas históricas — alimenta el ranking de más vendidos. */
  unitsSold: number;
  supplier: string;
  /** EAN-13 — se genera solo al crear el producto (ver lib/barcode.ts). */
  barcode: string;
  /** Si no hay foto todavía, la UI muestra un placeholder con las iniciales. */
  imageUrl?: string | undefined;
}

export const LOW_STOCK_THRESHOLD = 10;
