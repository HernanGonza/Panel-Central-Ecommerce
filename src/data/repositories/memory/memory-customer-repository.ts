import type { CustomerRepository } from "@/data/repositories/interfaces";
import { customers } from "@/data/fixtures/customers";
import { delay } from "@/data/repositories/memory/delay";

export const memoryCustomerRepository: CustomerRepository = {
  async list(filter) {
    const storeId = filter?.storeId;
    const result = storeId ? customers.filter((c) => c.storeIds.includes(storeId)) : customers;
    return delay([...result]);
  },
  async getById(id) {
    return delay(customers.find((c) => c.id === id));
  },
};
