import type { CustomerRepository } from "@/data/repositories/interfaces";
import { customers as customerFixtures } from "@/data/fixtures/customers";
import type { Customer } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const customers: Customer[] = [...customerFixtures];
let nextId = customers.length + 1;

export const memoryCustomerRepository: CustomerRepository = {
  async list(filter) {
    const storeId = filter?.storeId;
    const result = storeId ? customers.filter((c) => c.storeIds.includes(storeId)) : customers;
    return delay([...result]);
  },
  async getById(id) {
    return delay(customers.find((c) => c.id === id));
  },
  async create(input) {
    const customer: Customer = { ...input, id: `walkin-${nextId++}` };
    customers.push(customer);
    return delay(customer);
  },
};
