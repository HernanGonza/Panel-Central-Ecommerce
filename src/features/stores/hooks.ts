import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { Store } from "@/data/types";

export function useStores() {
  return useQuery({ queryKey: ["stores"], queryFn: () => repositories.stores.list() });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Store, "id" | "monthlySales" | "stockUnits" | "ordersCount">) =>
      repositories.stores.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
