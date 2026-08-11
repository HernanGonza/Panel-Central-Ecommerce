import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { OrderStatusBreakdownCard } from "@/features/reports/OrderStatusBreakdownCard";
import { SalesByChannelCard } from "@/features/reports/SalesByChannelCard";
import { SellerRankingCard } from "@/features/reports/SellerRankingCard";
import { useStores } from "@/features/stores/hooks";
import { useCustomers } from "@/features/customers/hooks";
import { formatCurrency, formatCurrencyCompact, formatNumber } from "@/lib/format";

export function StoreReportsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: stores = [] } = useStores();
  const { data: customers = [] } = useCustomers({ storeId });

  const store = stores.find((s) => s.id === storeId);
  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <>
      <PageHeader title="Reportes" subtitle="Desempeño de esta tienda" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Ventas del mes"
          value={formatCurrencyCompact(store?.monthlySales ?? 0)}
          tone="clay"
        />
        <StatCard
          label="Pedidos del mes"
          value={formatNumber(store?.ordersCount ?? 0)}
          tone="teal"
        />
        <StatCard label="Stock" value={`${formatNumber(store?.stockUnits ?? 0)} u.`} tone="gold" />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <OrderStatusBreakdownCard storeId={storeId} />
        <SalesByChannelCard storeId={storeId} />
        <SellerRankingCard storeId={storeId} />

        <SectionCard title="Top clientes" subtitle="Por gasto total en esta tienda">
          <ul className="space-y-4">
            {topCustomers.map((customer, i) => (
              <li key={customer.id} className="flex items-center gap-3">
                <span className="font-display text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.purchasesCount} compras</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatCurrency(customer.totalSpent)}
                </span>
              </li>
            ))}
            {topCustomers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Todavía no hay clientes en esta tienda.
              </p>
            )}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
