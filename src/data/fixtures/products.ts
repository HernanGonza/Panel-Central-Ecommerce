import type { Product } from "@/data/types";

export const products: Product[] = [
  { id: "p1", name: "Campera de jean oversize", category: "Abrigo", storeId: "norte", price: 38_900, stock: 24 },
  { id: "p2", name: "Remera básica algodón", category: "Remeras", storeId: "centro", price: 9_500, stock: 6 },
  { id: "p3", name: "Jean recto tiro alto", category: "Pantalones", storeId: "sur", price: 27_300, stock: 41 },
  { id: "p4", name: "Zapatillas urbanas", category: "Calzado", storeId: "norte", price: 52_000, stock: 12 },
  { id: "p5", name: "Vestido midi estampado", category: "Vestidos", storeId: "este", price: 31_400, stock: 3 },
  { id: "p6", name: "Buzo canguro friza", category: "Abrigo", storeId: "centro", price: 22_800, stock: 58 },
  { id: "p7", name: "Campera impermeable", category: "Abrigo", storeId: "sur", price: 45_000, stock: 4 },
  { id: "p8", name: "Zapatillas running", category: "Calzado", storeId: "norte", price: 48_000, stock: 5 },
  { id: "p9", name: "Buzo oversize gris", category: "Abrigo", storeId: "centro", price: 24_000, stock: 7 },
];

export const PRODUCT_CATEGORIES = [
  "Remeras",
  "Pantalones",
  "Abrigo",
  "Calzado",
  "Vestidos",
  "Accesorios",
] as const;
