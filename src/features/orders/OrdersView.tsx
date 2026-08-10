import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrders, useOrderStatusCounts } from "@/features/orders/hooks";
import { useStores } from "@/features/stores/hooks";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER, type OrderStatus } from "@/data/types";
import { ORDER_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OrdersView({ storeId }: { storeId?: string | undefined }) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const { data: stores = [] } = useStores();
  const { data: statusCounts } = useOrderStatusCounts({ storeId });
  const { data: orders = [] } = useOrders({ storeId, status: statusFilter ?? undefined });

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle={storeId ? "Pedidos de esta tienda, en tiempo real" : "Pedidos de todas las tiendas, en tiempo real"}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ORDER_STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter((current) => (current === status ? null : status))}
            className={cn(
              "rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-soft)] transition-colors",
              statusFilter === status && "ring-2 ring-accent",
            )}
          >
            <p className="text-xs text-muted-foreground">{ORDER_STATUS_LABEL[status]}</p>
            <p className="mt-2 font-display text-xl font-semibold text-foreground">
              {statusCounts?.[status] ?? 0}
            </p>
          </button>
        ))}
      </div>

      <SectionCard title="Pedidos recientes">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              {!storeId && <TableHead>Tienda</TableHead>}
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                {!storeId && <TableCell className="text-muted-foreground">{storeName(order.storeId)}</TableCell>}
                <TableCell className="text-muted-foreground">{order.customerName}</TableCell>
                <TableCell>
                  <StatusPill label={ORDER_STATUS_LABEL[order.status]} tone={ORDER_STATUS_TONE[order.status]} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatRelativeDate(order.createdAt)}</TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatCurrency(order.total)}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={storeId ? 5 : 6} className="py-10 text-center text-sm text-muted-foreground">
                  No hay pedidos que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>
    </>
  );
}
