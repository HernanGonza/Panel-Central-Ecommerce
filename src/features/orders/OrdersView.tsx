import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders, useOrderStatusCounts } from "@/features/orders/hooks";
import { useStores } from "@/features/stores/hooks";
import { OrderDetailDialog } from "@/features/orders/OrderDetailDialog";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER, type Order, type OrderStatus } from "@/data/types";
import { ORDER_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";

type SortKey = "id" | "customerName" | "createdAt" | "total";
type SortState = { key: SortKey; dir: "asc" | "desc" };

function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  align,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: "right";
}) {
  const active = sort.key === sortKey;
  const Icon = active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <TableHead className={align === "right" ? "text-right" : undefined}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </TableHead>
  );
}

export function OrdersView({
  storeId,
  headerAction,
}: {
  storeId?: string | undefined;
  headerAction?: ReactNode;
}) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: stores = [] } = useStores();
  const { data: statusCounts } = useOrderStatusCounts({ storeId });
  const { data: orders = [] } = useOrders({ storeId, status: statusFilter ?? undefined });

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const totalOrders = statusCounts ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : 0;

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  }

  const sortedOrders = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...orders].sort((a, b) => {
      if (sort.key === "createdAt")
        return factor * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      if (sort.key === "total") return factor * (a.total - b.total);
      return factor * a[sort.key].localeCompare(b[sort.key]);
    });
  }, [orders, sort]);

  function handleExport() {
    downloadCsv(
      "pedidos",
      [
        { label: "Pedido", key: "id" },
        { label: "Tienda", key: "tienda" },
        { label: "Cliente", key: "cliente" },
        { label: "Estado", key: "estado" },
        { label: "Fecha", key: "fecha" },
        { label: "Total", key: "total" },
      ],
      sortedOrders.map((order) => ({
        id: order.id,
        tienda: storeName(order.storeId),
        cliente: order.customerName,
        estado: ORDER_STATUS_LABEL[order.status],
        fecha: new Date(order.createdAt).toLocaleString("es-AR"),
        total: order.total,
      })),
    );
  }

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle={
          storeId
            ? "Pedidos de esta tienda, en tiempo real"
            : "Pedidos de todas las tiendas, en tiempo real"
        }
        action={headerAction}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <button
          type="button"
          onClick={() => setStatusFilter(null)}
          className={cn(
            "rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-soft)] transition-colors",
            statusFilter === null && "ring-2 ring-accent",
          )}
        >
          <p className="text-xs text-muted-foreground">Todos</p>
          <p className="mt-2 font-display text-xl font-semibold text-foreground">{totalOrders}</p>
        </button>
        {ORDER_STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
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

      <SectionCard
        title="Pedidos recientes"
        subtitle="Tocá un pedido para ver el detalle del cliente"
        action={
          <Button type="button" variant="outline" size="sm" onClick={handleExport}>
            <Download className="size-3.5" />
            Exportar CSV
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Pedido" sortKey="id" sort={sort} onSort={toggleSort} />
                {!storeId && <TableHead>Tienda</TableHead>}
                <SortableHead
                  label="Cliente"
                  sortKey="customerName"
                  sort={sort}
                  onSort={toggleSort}
                />
                <TableHead>Estado</TableHead>
                <SortableHead label="Fecha" sortKey="createdAt" sort={sort} onSort={toggleSort} />
                <SortableHead
                  label="Total"
                  sortKey="total"
                  sort={sort}
                  onSort={toggleSort}
                  align="right"
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                  {!storeId && (
                    <TableCell className="text-muted-foreground">
                      {storeName(order.storeId)}
                    </TableCell>
                  )}
                  <TableCell className="text-muted-foreground">{order.customerName}</TableCell>
                  <TableCell>
                    <StatusPill
                      label={ORDER_STATUS_LABEL[order.status]}
                      tone={ORDER_STATUS_TONE[order.status]}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>
              ))}
              {sortedOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={storeId ? 5 : 6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No hay pedidos que coincidan con el filtro.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <OrderDetailDialog
        order={selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
    </>
  );
}
