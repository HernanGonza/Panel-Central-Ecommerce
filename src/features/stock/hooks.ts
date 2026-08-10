import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import { LOW_STOCK_THRESHOLD } from "@/data/types";

export function useLowStock(storeId?: string | undefined) {
  return useQuery({
    queryKey: ["products", "low-stock", storeId ?? null],
    queryFn: () => repositories.products.lowStock(LOW_STOCK_THRESHOLD, { storeId }),
  });
}
