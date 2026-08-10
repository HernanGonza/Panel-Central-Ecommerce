import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";

export function useInvoices() {
  return useQuery({ queryKey: ["invoices"], queryFn: () => repositories.invoices.list() });
}

export function usePaymentMethodStats() {
  return useQuery({
    queryKey: ["invoices", "payment-method-stats"],
    queryFn: () => repositories.invoices.paymentMethodStats(),
  });
}
