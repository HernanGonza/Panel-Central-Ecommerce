import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { OrderStatus } from "@/data/types";

export function useOrders(filter?: { storeId?: string; status?: OrderStatus }) {
  return useQuery({
    queryKey: ["orders", filter ?? {}],
    queryFn: () => repositories.orders.list(filter),
  });
}

export function useOrderStatusCounts(filter?: { storeId?: string }) {
  return useQuery({
    queryKey: ["orders", "status-counts", filter ?? {}],
    queryFn: () => repositories.orders.countByStatus(filter),
  });
}
