import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { Supplier } from "@/data/types";

export function useSuppliers() {
  return useQuery({ queryKey: ["suppliers"], queryFn: () => repositories.suppliers.list() });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Supplier, "id">) => repositories.suppliers.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
