import type {
  AppUser,
  Customer,
  Invoice,
  Order,
  OrderStatus,
  Product,
  Store,
} from "@/data/types";
import type { salesByCategory, salesTrend, stockByCategory, topSellingProducts } from "@/data/fixtures/analytics";
import type { paymentMethodStats } from "@/data/fixtures/invoices";

export interface StoreRepository {
  list(): Promise<Store[]>;
  getById(id: string): Promise<Store | undefined>;
}

export interface ProductRepository {
  list(filter?: { storeId?: string; category?: string }): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
  lowStock(threshold?: number, filter?: { storeId?: string }): Promise<Product[]>;
  create(input: Omit<Product, "id">): Promise<Product>;
  update(id: string, patch: Partial<Omit<Product, "id">>): Promise<Product>;
}

export interface OrderRepository {
  list(filter?: { storeId?: string; status?: OrderStatus }): Promise<Order[]>;
  getById(id: string): Promise<Order | undefined>;
  countByStatus(filter?: { storeId?: string }): Promise<Record<OrderStatus, number>>;
}

export interface CustomerRepository {
  list(filter?: { storeId?: string }): Promise<Customer[]>;
  getById(id: string): Promise<Customer | undefined>;
}

export interface InvoiceRepository {
  list(filter?: { storeId?: string }): Promise<Invoice[]>;
  paymentMethodStats(): Promise<typeof paymentMethodStats>;
}

export interface UserRepository {
  list(filter?: { storeId?: string }): Promise<AppUser[]>;
  getById(id: string): Promise<AppUser | undefined>;
}

export interface AnalyticsRepository {
  salesTrend(): Promise<typeof salesTrend>;
  stockByCategory(): Promise<typeof stockByCategory>;
  salesByCategory(): Promise<typeof salesByCategory>;
  topSellingProducts(): Promise<typeof topSellingProducts>;
}
