import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { useStores } from "@/features/stores/hooks";
import { useOrderStatusCounts } from "@/features/orders/hooks";
import { useCustomers } from "@/features/customers/hooks";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER } from "@/data/types";
import { ORDER_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrency, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

export function StoreReportsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: stores = [] } = useStores();
  const { data: statusCounts } = useOrderStatusCounts({ storeId });
  const { data: customers = [] } = useCustomers({ storeId });

  const store = stores.find((s) => s.id === storeId);
  const totalOrders = statusCounts ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : 0;
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Pedidos por estado"
          subtitle="Sobre los pedidos registrados de esta tienda"
        >
          <div className="space-y-4">
            {ORDER_STATUS_ORDER.map((status) => {
              const value = statusCounts?.[status] ?? 0;
              const pct = totalOrders > 0 ? (value / totalOrders) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{ORDER_STATUS_LABEL[status]}</span>
                    <span className="font-semibold text-foreground">{value}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: TONE_COLOR[ORDER_STATUS_TONE[status]],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

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
