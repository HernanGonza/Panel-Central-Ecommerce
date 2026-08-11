import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, useOrderStatusCounts } from "@/features/orders/hooks";
import { useStores } from "@/features/stores/hooks";
import { useUsers } from "@/features/users/hooks";
import { OrderDetailDialog } from "@/features/orders/OrderDetailDialog";
import { useAuth } from "@/auth/useAuth";
import {
  ORDER_CHANNEL_LABEL,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_ORDER,
  isOwnerRole,
  type Order,
  type OrderStatus,
} from "@/data/types";
import { ORDER_CHANNEL_TONE, ORDER_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";

const ALL_SELLERS = "__all__";

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
  const { session } = useAuth();
  const role = session?.user.role;
  const isVendedor = role === "vendedor";
  const canFilterSellers = role ? isOwnerRole(role) || role === "gerente" : false;
  const showSellerColumns = !isVendedor;

  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const initialStatus = ORDER_STATUS_ORDER.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : null;

  const [statusFilter, setStatusFilterState] = useState<OrderStatus | null>(initialStatus);
  const [sellerFilter, setSellerFilter] = useState<string>(ALL_SELLERS);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: stores = [] } = useStores();
  const { data: sellers = [] } = useUsers({ storeId });

  function setStatusFilter(status: OrderStatus | null) {
    setStatusFilterState(status);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (status) next.set("status", status);
        else next.delete("status");
        return next;
      },
      { replace: true },
    );
  }

  // Un vendedor solo ve sus propias ventas; gerente/dueño pueden filtrar por vendedor.
  const sellerId = isVendedor
    ? session?.user.id
    : sellerFilter === ALL_SELLERS
      ? undefined
      : sellerFilter;

  const dateRange = { dateFrom: dateFrom || undefined, dateTo: dateTo || undefined };
  const { data: statusCounts } = useOrderStatusCounts({ storeId, sellerId, ...dateRange });
  const { data: orders = [] } = useOrders({
    storeId,
    status: statusFilter ?? undefined,
    sellerId,
    ...dateRange,
  });

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const sellerName = (id: string) => sellers.find((u) => u.id === id)?.name ?? id;
  const totalOrders = statusCounts ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : 0;
  const columnCount = 5 + (storeId ? 0 : 1) + (showSellerColumns ? 2 : 0);

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
        { label: "Vendedor", key: "vendedor" },
        { label: "Canal", key: "canal" },
        { label: "Estado", key: "estado" },
        { label: "Fecha", key: "fecha" },
        { label: "Total", key: "total" },
      ],
      sortedOrders.map((order) => ({
        id: order.id,
        tienda: storeName(order.storeId),
        cliente: order.customerName,
        vendedor: order.sellerId ? sellerName(order.sellerId) : "—",
        canal: ORDER_CHANNEL_LABEL[order.channel],
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
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeFilter
              from={dateFrom}
              to={dateTo}
              onFromChange={setDateFrom}
              onToChange={setDateTo}
            />
            {canFilterSellers && (
              <Select value={sellerFilter} onValueChange={setSellerFilter}>
                <SelectTrigger size="sm" className="w-44">
                  <SelectValue placeholder="Vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_SELLERS}>Todos los vendedores</SelectItem>
                  {sellers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-3.5" />
              Exportar CSV
            </Button>
          </div>
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
                {showSellerColumns && <TableHead>Vendedor</TableHead>}
                {showSellerColumns && <TableHead>Canal</TableHead>}
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
                  {showSellerColumns && (
                    <TableCell className="text-muted-foreground">
                      {order.sellerId ? sellerName(order.sellerId) : "—"}
                    </TableCell>
                  )}
                  {showSellerColumns && (
                    <TableCell>
                      <StatusPill
                        label={ORDER_CHANNEL_LABEL[order.channel]}
                        tone={ORDER_CHANNEL_TONE[order.channel]}
                      />
                    </TableCell>
                  )}
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
                    colSpan={columnCount}
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
