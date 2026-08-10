import type { StoreRepository } from "@/data/repositories/interfaces";
import { stores as storeFixtures } from "@/data/fixtures/stores";
import type { Store } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const stores: Store[] = [...storeFixtures];
let nextId = stores.length + 1;

export const memoryStoreRepository: StoreRepository = {
  async list() {
    return delay([...stores]);
  },
  async getById(id) {
    return delay(stores.find((s) => s.id === id));
  },
  async create(input) {
    const store: Store = {
      ...input,
      id: `store-${nextId++}`,
      monthlySales: 0,
      stockUnits: 0,
      ordersCount: 0,
    };
    stores.push(store);
    return delay(store);
  },
};
