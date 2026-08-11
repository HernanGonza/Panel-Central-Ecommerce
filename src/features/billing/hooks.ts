import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { DateRangeFilter, StoreScoped } from "@/data/repositories/interfaces";
import type { Invoice } from "@/data/types";

export function useInvoices(filter?: StoreScoped & DateRangeFilter) {
  return useQuery({
    queryKey: ["invoices", filter ?? {}],
    queryFn: () => repositories.invoices.list(filter),
  });
}

export function useInvoiceByOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ["invoices", "by-order", orderId ?? null],
    queryFn: () => repositories.invoices.getByOrderId(orderId ?? ""),
    enabled: orderId !== undefined,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Invoice, "id">) => repositories.invoices.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
