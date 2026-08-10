import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";

export function useDashboardData() {
  const stores = useQuery({ queryKey: ["stores"], queryFn: () => repositories.stores.list() });
  const orderStatusCounts = useQuery({
    queryKey: ["orders", "status-counts"],
    queryFn: () => repositories.orders.countByStatus(),
  });
  const recentOrders = useQuery({ queryKey: ["orders", "all"], queryFn: () => repositories.orders.list() });
  const salesTrend = useQuery({
    queryKey: ["analytics", "sales-trend"],
    queryFn: () => repositories.analytics.salesTrend(),
  });

  return { stores, orderStatusCounts, recentOrders, salesTrend };
}
