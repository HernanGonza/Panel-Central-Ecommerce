import { memoryStoreRepository } from "@/data/repositories/memory/memory-store-repository";
import { memoryProductRepository } from "@/data/repositories/memory/memory-product-repository";
import { memoryOrderRepository } from "@/data/repositories/memory/memory-order-repository";
import { memoryCustomerRepository } from "@/data/repositories/memory/memory-customer-repository";
import { memoryInvoiceRepository } from "@/data/repositories/memory/memory-invoice-repository";
import { memoryUserRepository } from "@/data/repositories/memory/memory-user-repository";
import { memoryAnalyticsRepository } from "@/data/repositories/memory/memory-analytics-repository";

/**
 * Único punto de acceso a los repositorios. Todo el resto de la app (hooks de
 * features, auth) importa de acá, nunca de las implementaciones concretas.
 * Cuando se conecte Supabase, esto pasa a apuntar a implementaciones
 * `supabase/*` con la misma interfaz — nada más cambia.
 */
export const repositories = {
  stores: memoryStoreRepository,
  products: memoryProductRepository,
  orders: memoryOrderRepository,
  customers: memoryCustomerRepository,
  invoices: memoryInvoiceRepository,
  users: memoryUserRepository,
  analytics: memoryAnalyticsRepository,
};
