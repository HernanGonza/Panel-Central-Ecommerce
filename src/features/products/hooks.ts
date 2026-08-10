import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";
import type { Product } from "@/data/types";

export function useProducts(filter?: StoreScoped & { category?: string | undefined }) {
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

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<Product, "id">> }) =>
      repositories.products.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => repositories.categories.list() });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => repositories.categories.create(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
