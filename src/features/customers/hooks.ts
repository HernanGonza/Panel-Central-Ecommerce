import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";
import type { Customer } from "@/data/types";

export function useCustomers(filter?: StoreScoped) {
  return useQuery({
    queryKey: ["customers", filter ?? {}],
    queryFn: () => repositories.customers.list(filter),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Customer, "id">) => repositories.customers.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customers", id ?? null],
    queryFn: () => repositories.customers.getById(id ?? ""),
    enabled: id !== undefined,
  });
}
