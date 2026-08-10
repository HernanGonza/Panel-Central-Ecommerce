import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";
import type { Order, OrderStatus } from "@/data/types";

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

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Order, "id" | "createdAt">) => repositories.orders.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
