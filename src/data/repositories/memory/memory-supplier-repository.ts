import type { SupplierRepository } from "@/data/repositories/interfaces";
import { suppliers as supplierFixtures } from "@/data/fixtures/suppliers";
import type { Supplier } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const suppliers: Supplier[] = [...supplierFixtures];
let nextId = suppliers.length + 1;

export const memorySupplierRepository: SupplierRepository = {
  async list() {
    return delay([...suppliers]);
  },
  async create(input) {
    const supplier: Supplier = { ...input, id: `sup-${nextId++}` };
    suppliers.push(supplier);
    return delay(supplier);
  },
};
