import type { StoreRepository } from "@/data/repositories/interfaces";
import { stores } from "@/data/fixtures/stores";
import { delay } from "@/data/repositories/memory/delay";

export const memoryStoreRepository: StoreRepository = {
  async list() {
    return delay([...stores]);
  },
  async getById(id) {
    return delay(stores.find((s) => s.id === id));
  },
};
