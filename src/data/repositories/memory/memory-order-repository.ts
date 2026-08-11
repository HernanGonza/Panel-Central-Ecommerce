import type { OrderRepository } from "@/data/repositories/interfaces";
import { orders as orderFixtures } from "@/data/fixtures/orders";
import { ORDER_STATUS_ORDER, type Order, type OrderStatus } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const orders: Order[] = [...orderFixtures];
let nextNum = Math.max(...orders.map((o) => parseInt(o.id.replace("#", ""), 10))) + 1;

export const memoryOrderRepository: OrderRepository = {
  async list(filter) {
    let result = orders;
    if (filter?.storeId) result = result.filter((o) => o.storeId === filter.storeId);
    if (filter?.status) result = result.filter((o) => o.status === filter.status);
    if (filter?.sellerId) result = result.filter((o) => o.sellerId === filter.sellerId);
    return delay(
      [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  },
  async getById(id) {
    return delay(orders.find((o) => o.id === id));
  },
  async countByStatus(filter) {
    let scoped = filter?.storeId ? orders.filter((o) => o.storeId === filter.storeId) : orders;
    if (filter?.sellerId) scoped = scoped.filter((o) => o.sellerId === filter.sellerId);
    const counts = Object.fromEntries(ORDER_STATUS_ORDER.map((s) => [s, 0])) as Record<
      OrderStatus,
      number
    >;
    for (const o of scoped) counts[o.status] += 1;
    return delay(counts);
  },
  async create(input) {
    const order: Order = { ...input, id: `#${nextNum++}`, createdAt: new Date().toISOString() };
    orders.unshift(order);
    return delay(order);
  },
};
