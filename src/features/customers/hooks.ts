import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";

export function useCustomers(filter?: { storeId?: string }) {
  return useQuery({
    queryKey: ["customers", filter ?? {}],
    queryFn: () => repositories.customers.list(filter),
  });
}
