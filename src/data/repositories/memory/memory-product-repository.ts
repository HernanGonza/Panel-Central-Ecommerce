import type { ProductRepository } from "@/data/repositories/interfaces";
import { products as productFixtures } from "@/data/fixtures/products";
import { LOW_STOCK_THRESHOLD, type Product } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const products: Product[] = [...productFixtures];
let nextId = products.length + 1;

export const memoryProductRepository: ProductRepository = {
  async list(filter) {
    let result = products;
    if (filter?.storeId) result = result.filter((p) => p.storeId === filter.storeId);
    if (filter?.category) result = result.filter((p) => p.category === filter.category);
    return delay([...result]);
  },
  async getById(id) {
    return delay(products.find((p) => p.id === id));
  },
  async lowStock(threshold = LOW_STOCK_THRESHOLD, filter) {
    let result = products.filter((p) => p.stock < threshold);
    if (filter?.storeId) result = result.filter((p) => p.storeId === filter.storeId);
    return delay([...result]);
  },
  async create(input) {
    const product: Product = { ...input, id: `p${nextId++}` };
    products.push(product);
    return delay(product);
  },
  async update(id, patch) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Producto ${id} no encontrado`);
    const current = products[index];
    if (!current) throw new Error(`Producto ${id} no encontrado`);
    const updated: Product = { ...current, ...patch };
    products[index] = updated;
    return delay(updated);
  },
};
