import type { AnalyticsRepository } from "@/data/repositories/interfaces";
import { salesByCategory, salesTrend, topSellingProducts } from "@/data/fixtures/analytics";
import { delay } from "@/data/repositories/memory/delay";

export const memoryAnalyticsRepository: AnalyticsRepository = {
  async salesTrend() {
    return delay(salesTrend);
  },
  async salesByCategory() {
    return delay(salesByCategory);
  },
  async topSellingProducts() {
    return delay(topSellingProducts);
  },
};
