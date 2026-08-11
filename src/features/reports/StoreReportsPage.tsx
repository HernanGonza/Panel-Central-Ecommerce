import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { useStores } from "@/features/stores/hooks";
import { useOrders, useOrderStatusCounts } from "@/features/orders/hooks";
import { useUsers } from "@/features/users/hooks";
import { useCustomers } from "@/features/customers/hooks";
import {
  ORDER_CHANNEL_LABEL,
  ORDER_CHANNEL_ORDER,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_ORDER,
} from "@/data/types";
import { ORDER_CHANNEL_TONE, ORDER_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrency, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

const TOP_SELLERS_LIMIT = 5;

export function StoreReportsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: stores = [] } = useStores();
  const { data: statusCounts } = useOrderStatusCounts({ storeId });
  const { data: orders = [] } = useOrders({ storeId });
  const { data: users = [] } = useUsers({ storeId });
  const { data: customers = [] } = useCustomers({ storeId });

  const store = stores.find((s) => s.id === storeId);
  const totalOrders = statusCounts ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : 0;
  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const channelBreakdown = useMemo(() => {
    const totals = new Map<string, { count: number; total: number }>();
    for (const o of orders) {
      const entry = totals.get(o.channel) ?? { count: 0, total: 0 };
      entry.count += 1;
      entry.total += o.total;
      totals.set(o.channel, entry);
    }
    const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
    return ORDER_CHANNEL_ORDER.map((channel) => {
      const entry = totals.get(channel) ?? { count: 0, total: 0 };
      return {
        channel,
        count: entry.count,
        total: entry.total,
        pct: grandTotal > 0 ? (entry.total / grandTotal) * 100 : 0,
      };
    });
  }, [orders]);

  const sellerRanking = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of orders) {
      if (!order.sellerId) continue;
      totals.set(order.sellerId, (totals.get(order.sellerId) ?? 0) + order.total);
    }
    return [...totals.entries()]
      .map(([sellerId, total]) => ({
        sellerId,
        name: users.find((u) => u.id === sellerId)?.name ?? sellerId,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_SELLERS_LIMIT);
  }, [orders, users]);

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

        <SectionCard title="Ventas por canal" subtitle="En local vs. online">
          <div className="space-y-4">
            {channelBreakdown.map((c) => (
              <div key={c.channel}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{ORDER_CHANNEL_LABEL[c.channel]}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrencyCompact(c.total)} · {formatNumber(c.count)}{" "}
                    {c.count === 1 ? "venta" : "ventas"}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${c.pct}%`,
                      backgroundColor: TONE_COLOR[ORDER_CHANNEL_TONE[c.channel]],
                    }}
                  />
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground">Todavía no hay ventas cargadas.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Vendedores" subtitle="Ranking por monto vendido en esta tienda">
          <ol className="space-y-4">
            {sellerRanking.map((seller, i) => (
              <li key={seller.sellerId} className="flex items-center gap-3">
                <span className="font-display text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {seller.name}
                </p>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatCurrency(seller.total)}
                </span>
              </li>
            ))}
            {sellerRanking.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Todavía no hay ventas cargadas por vendedores.
              </p>
            )}
          </ol>
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
