import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { AnimatedBar } from "@/components/shared/AnimatedBar";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/features/dashboard/hooks";
import { OrderDetailDialog } from "@/features/orders/OrderDetailDialog";
import { formatCurrencyCompact, formatNumber, formatRelativeDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER, type Order } from "@/data/types";
import { ORDER_STATUS_TONE, STORE_STATUS_TONE } from "@/lib/status-tones";
import { TONE_COLOR } from "@/lib/tones";

export function DashboardPage() {
  const { stores, orderStatusCounts, recentOrders, salesTrend } = useDashboardData();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const storeList = stores.data ?? [];
  const totalStock = storeList.reduce((sum, s) => sum + s.stockUnits, 0);
  const totalOrders = storeList.reduce((sum, s) => sum + s.ordersCount, 0);
  const totalSales = storeList.reduce((sum, s) => sum + s.monthlySales, 0);
  const maxStock = Math.max(1, ...storeList.map((s) => s.stockUnits));

  return (
    <>
      <PageHeader
        title="Panel general"
        subtitle="Todas las tiendas · vista consolidada"
        action={
          <Button asChild size="sm">
            <Link to="/admin/tiendas">
              <Plus className="size-4" />
              Nueva tienda
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tiendas activas"
          value={String(storeList.length)}
          tone="clay"
          to="/admin/tiendas"
        />
        <StatCard
          label="Stock consolidado"
          value={`${formatNumber(totalStock)} u.`}
          tone="teal"
          to="/admin/stock"
        />
        <StatCard
          label="Pedidos del mes"
          value={formatNumber(totalOrders)}
          tone="gold"
          to="/admin/pedidos"
        />
        <StatCard
          label="Facturación"
          value={formatCurrencyCompact(totalSales)}
          tone="ink"
          to="/admin/facturacion"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <SectionCard
          title="Ventas consolidadas"
          subtitle="Últimos 12 meses · todas las tiendas"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend.data ?? []} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="currentYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TONE_COLOR.clay} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TONE_COLOR.clay} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="previousYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TONE_COLOR.teal} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={TONE_COLOR.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  tickFormatter={(v: number) => `$${v}M`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `$${value} M`,
                    name === "currentYear" ? "Este año" : "Año anterior",
                  ]}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend
                  formatter={(value) => (value === "currentYear" ? "Este año" : "Año anterior")}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="currentYear"
                  stroke={TONE_COLOR.clay}
                  strokeWidth={2.5}
                  fill="url(#currentYear)"
                  name="currentYear"
                />
                <Area
                  type="monotone"
                  dataKey="previousYear"
                  stroke={TONE_COLOR.teal}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#previousYear)"
                  name="previousYear"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Pedidos recientes">
          <ul className="space-y-1">
            {(recentOrders.data ?? []).slice(0, 5).map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="flex w-full items-start gap-3 rounded-lg p-1.5 text-left transition-colors hover:bg-secondary"
                >
                  <span
                    className="mt-1 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: TONE_COLOR[ORDER_STATUS_TONE[order.status]] }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {order.id} · {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ORDER_STATUS_LABEL[order.status]} · {formatRelativeDate(order.createdAt)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <SectionCard title="Stock consolidado por tienda">
          <div className="space-y-3">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">
                  {store.name}
                </span>
                <AnimatedBar
                  pct={(store.stockUnits / maxStock) * 100}
                  color={TONE_COLOR[STORE_STATUS_TONE[store.status]]}
                  trackClassName="mt-0 flex-1"
                />
                <span className="w-16 shrink-0 text-right text-xs font-medium text-foreground">
                  {formatNumber(store.stockUnits)}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Pedidos por estado">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ORDER_STATUS_ORDER.map((status) => (
              <Link
                key={status}
                to={`/admin/pedidos?status=${status}`}
                className="block rounded-xl bg-secondary/60 p-3 transition-colors hover:bg-secondary"
              >
                <StatusPill label={ORDER_STATUS_LABEL[status]} tone={ORDER_STATUS_TONE[status]} />
                <p className="mt-3 font-display text-xl font-semibold text-foreground">
                  {orderStatusCounts.data?.[status] ?? 0}
                </p>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      <OrderDetailDialog
        order={selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
    </>
  );
}
