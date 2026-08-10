import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";
import type { OrderStatus } from "@/data/types";

export function useOrders(filter?: StoreScoped & { status?: OrderStatus | undefined }) {
  return useQuery({
    queryKey: ["orders", filter ?? {}],
    queryFn: () => repositories.orders.list(filter),
  });
}

export function useOrderStatusCounts(filter?: StoreScoped) {
  return useQuery({
    queryKey: ["orders", "status-counts", filter ?? {}],
    queryFn: () => repositories.orders.countByStatus(filter),
  });
}
