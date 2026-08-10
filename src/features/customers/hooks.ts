import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";

export function useCustomers(filter?: StoreScoped) {
  return useQuery({
    queryKey: ["customers", filter ?? {}],
    queryFn: () => repositories.customers.list(filter),
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customers", id ?? null],
    queryFn: () => repositories.customers.getById(id ?? ""),
    enabled: id !== undefined,
  });
}
