import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { Invoice } from "@/data/types";

export function useInvoices() {
  return useQuery({ queryKey: ["invoices"], queryFn: () => repositories.invoices.list() });
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

export function usePaymentMethodStats() {
  return useQuery({
    queryKey: ["invoices", "payment-method-stats"],
    queryFn: () => repositories.invoices.paymentMethodStats(),
  });
}
