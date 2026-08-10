import type { AppUser, Customer, Invoice, Order, OrderStatus, Product, Store } from "@/data/types";
import type { salesByCategory, salesTrend } from "@/data/fixtures/analytics";
import type { paymentMethodStats } from "@/data/fixtures/invoices";

/** `storeId` viaja como `string | undefined` en toda la app (viene de useParams/props opcionales). */
export interface StoreScoped {
  storeId?: string | undefined;
}

export interface StoreRepository {
  list(): Promise<Store[]>;
  getById(id: string): Promise<Store | undefined>;
  create(input: Omit<Store, "id" | "monthlySales" | "stockUnits" | "ordersCount">): Promise<Store>;
}

export interface ProductRepository {
  list(filter?: StoreScoped & { category?: string | undefined }): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
  lowStock(threshold?: number, filter?: StoreScoped): Promise<Product[]>;
  create(input: Omit<Product, "id">): Promise<Product>;
  update(id: string, patch: Partial<Omit<Product, "id">>): Promise<Product>;
}

export interface OrderRepository {
  list(filter?: StoreScoped & { status?: OrderStatus | undefined }): Promise<Order[]>;
  getById(id: string): Promise<Order | undefined>;
  countByStatus(filter?: StoreScoped): Promise<Record<OrderStatus, number>>;
  create(input: Omit<Order, "id" | "createdAt">): Promise<Order>;
}

export interface CustomerRepository {
  list(filter?: StoreScoped): Promise<Customer[]>;
  getById(id: string): Promise<Customer | undefined>;
}

export interface InvoiceRepository {
  list(filter?: StoreScoped): Promise<Invoice[]>;
  paymentMethodStats(): Promise<typeof paymentMethodStats>;
}

export interface UserRepository {
  list(filter?: StoreScoped): Promise<AppUser[]>;
  getById(id: string): Promise<AppUser | undefined>;
}

export interface AnalyticsRepository {
  salesTrend(): Promise<typeof salesTrend>;
  salesByCategory(): Promise<typeof salesByCategory>;
}
