import type { OrderRepository } from "@/data/repositories/interfaces";
import { orders } from "@/data/fixtures/orders";
import { ORDER_STATUS_ORDER, type OrderStatus } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

export const memoryOrderRepository: OrderRepository = {
  async list(filter) {
    let result = orders;
    if (filter?.storeId) result = result.filter((o) => o.storeId === filter.storeId);
    if (filter?.status) result = result.filter((o) => o.status === filter.status);
    return delay(
      [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  },
  async getById(id) {
    return delay(orders.find((o) => o.id === id));
  },
  async countByStatus(filter) {
    const scoped = filter?.storeId ? orders.filter((o) => o.storeId === filter.storeId) : orders;
    const counts = Object.fromEntries(ORDER_STATUS_ORDER.map((s) => [s, 0])) as Record<OrderStatus, number>;
    for (const o of scoped) counts[o.status] += 1;
    return delay(counts);
  },
};
