import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesByCategory } from "@/features/reports/hooks";
import { useStores } from "@/features/stores/hooks";
import { useProducts } from "@/features/products/hooks";
import { useCustomers } from "@/features/customers/hooks";
import { useOrders } from "@/features/orders/hooks";
import { useUsers } from "@/features/users/hooks";
import { formatCurrency, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

const CATEGORY_COLOR = [TONE_COLOR.clay, TONE_COLOR.teal, TONE_COLOR.gold, TONE_COLOR.success];
const ALL = "__all__";
const TOP_PRODUCTS_LIMIT = 5;
const TOP_CUSTOMERS_LIMIT = 5;

export function ReportsPage() {
  const { data: categories = [] } = useSalesByCategory();
  const { data: stores = [] } = useStores();
  const { data: customers = [] } = useCustomers();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  const [productStoreFilter, setProductStoreFilter] = useState(ALL);
  const { data: products = [] } = useProducts({
    storeId: productStoreFilter === ALL ? undefined : productStoreFilter,
  });

  const maxSales = Math.max(1, ...stores.map((s) => s.monthlySales));
  const leader = categories[0];

  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, TOP_PRODUCTS_LIMIT),
    [products],
  );

  const topCustomers = useMemo(
    () => [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, TOP_CUSTOMERS_LIMIT),
    [customers],
  );

  const sellerRanking = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of orders) {
      if (!order.sellerId) continue;
      totals.set(order.sellerId, (totals.get(order.sellerId) ?? 0) + order.total);
    }
    return [...totals.entries()]
      .map(([sellerId, total]) => {
        const seller = users.find((u) => u.id === sellerId);
        const storeName = stores.find((s) => s.id === seller?.storeIds[0])?.name;
        return { sellerId, name: seller?.name ?? sellerId, storeName, total };
      })
      .sort((a, b) => b.total - a.total);
  }, [orders, users, stores]);

  return (
    <>
      <PageHeader title="Reportes" subtitle="Comparativa de ventas entre tiendas" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Ventas por categoría" subtitle="Participación sobre el total del mes">
          <div className="flex items-center gap-6">
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="pct"
                    nameKey="category"
                    innerRadius={52}
                    outerRadius={78}
                    startAngle={90}
                    endAngle={-270}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                  >
                    {categories.map((entry, i) => (
                      <Cell key={entry.category} fill={CATEGORY_COLOR[i % CATEGORY_COLOR.length] ?? TONE_COLOR.clay} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} %`, name]}
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {leader && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-xl font-semibold text-foreground">{leader.pct} %</span>
                  <span className="text-[11px] text-muted-foreground">{leader.category}</span>
                </div>
              )}
            </div>
            <ul className="flex-1 space-y-2.5">
              {categories.map((c, i) => (
                <li key={c.category} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="size-2.5 rounded-sm"
                      style={{ backgroundColor: CATEGORY_COLOR[i % CATEGORY_COLOR.length] ?? TONE_COLOR.clay }}
                    />
                    {c.category}
                  </span>
                  <span className="font-semibold text-foreground">{c.pct} %</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Ventas por tienda" subtitle="Comparativa del mes">
          <div className="space-y-4">
            {stores.map((store, i) => (
              <div key={store.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{store.name}</span>
                  <span className="font-semibold text-foreground">{formatCurrencyCompact(store.monthlySales)}</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(store.monthlySales / maxSales) * 100}%`,
                      backgroundColor: TONE_COLOR.clay,
                      opacity: 0.5 + i * 0.15,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Productos más vendidos"
          subtitle="Unidades históricas"
          action={
            <Select value={productStoreFilter} onValueChange={setProductStoreFilter}>
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="Tienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas las tiendas</SelectItem>
                {stores.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        >
          <ol className="space-y-4">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-display text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <ProductThumbnail name={p.name} imageUrl={p.imageUrl} className="size-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(p.unitsSold)} u.</p>
                </div>
              </li>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin datos para esta tienda.</p>
            )}
          </ol>
        </SectionCard>

        <SectionCard title="Clientes que más compraron" subtitle="Por gasto total">
          <ol className="space-y-4">
            {topCustomers.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3">
                <span className="font-display text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.purchasesCount} compras</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatCurrency(c.totalSpent)}
                </span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard
          title="Vendedores"
          subtitle="Ranking por monto vendido"
          className="lg:col-span-2"
        >
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sellerRanking.map((seller, i) => (
              <li key={seller.sellerId} className="flex items-center gap-3">
                <span className="font-display text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{seller.name}</p>
                  <p className="text-xs text-muted-foreground">{seller.storeName ?? "—"}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatCurrency(seller.total)}
                </span>
              </li>
            ))}
            {sellerRanking.length === 0 && (
              <p className="text-sm text-muted-foreground">Todavía no hay ventas cargadas por vendedores.</p>
            )}
          </ol>
        </SectionCard>
      </div>
    </>
  );
}
