import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";

export function useSalesByCategory() {
  return useQuery({
    queryKey: ["analytics", "sales-by-category"],
    queryFn: () => repositories.analytics.salesByCategory(),
  });
}
