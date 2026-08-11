import { useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useOrders } from "@/features/orders/hooks";
import { useUsers } from "@/features/users/hooks";
import { useStores } from "@/features/stores/hooks";
import { formatCurrency } from "@/lib/format";

const TOP_SELLERS_LIMIT = 5;

export function SellerRankingCard({
  storeId,
  className = "",
}: {
  storeId?: string | undefined;
  className?: string;
}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { data: orders = [] } = useOrders({
    storeId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const { data: users = [] } = useUsers({ storeId });
  const { data: stores = [] } = useStores();

  const sellerRanking = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of orders) {
      if (!order.sellerId) continue;
      totals.set(order.sellerId, (totals.get(order.sellerId) ?? 0) + order.total);
    }
    return [...totals.entries()]
      .map(([sellerId, total]) => {
        const seller = users.find((u) => u.id === sellerId);
        const sellerStoreName = storeId
          ? undefined
          : stores.find((s) => s.id === seller?.storeIds[0])?.name;
        return { sellerId, name: seller?.name ?? sellerId, sellerStoreName, total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_SELLERS_LIMIT);
  }, [orders, users, stores, storeId]);

  return (
    <SectionCard
      title="Vendedores"
      subtitle={storeId ? "Ranking por monto vendido en esta tienda" : "Ranking por monto vendido"}
      className={className}
      action={
        <DateRangeFilter
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />
      }
    >
      <ol className={storeId ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
        {sellerRanking.map((seller, i) => (
          <li key={seller.sellerId} className="flex items-center gap-3">
            <span className="font-display text-sm text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{seller.name}</p>
              {seller.sellerStoreName && (
                <p className="text-xs text-muted-foreground">{seller.sellerStoreName}</p>
              )}
            </div>
            <span className="shrink-0 text-sm font-semibold text-foreground">
              {formatCurrency(seller.total)}
            </span>
          </li>
        ))}
        {sellerRanking.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay ventas cargadas por vendedores en el rango elegido.
          </p>
        )}
      </ol>
    </SectionCard>
  );
}
