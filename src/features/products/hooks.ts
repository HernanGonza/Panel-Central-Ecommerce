import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { Product } from "@/data/types";

export function useProducts(filter?: { storeId?: string; category?: string }) {
  return useQuery({
    queryKey: ["products", filter ?? {}],
    queryFn: () => repositories.products.list(filter),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Product, "id">) => repositories.products.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
