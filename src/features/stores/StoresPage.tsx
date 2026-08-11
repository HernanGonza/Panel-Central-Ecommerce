import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { useStores } from "@/features/stores/hooks";
import { STORE_STATUS_LABEL } from "@/data/types";
import { STORE_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { NewStoreDialog } from "@/features/stores/NewStoreDialog";

export function StoresPage() {
  const { data: stores = [] } = useStores();

  return (
    <>
      <PageHeader
        title="Tiendas"
        subtitle={`${stores.length} tiendas en la red`}
        action={<NewStoreDialog />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {stores.map((store) => (
          <SectionCard
            key={store.id}
            title={store.name}
            subtitle={store.zone}
            action={
              <StatusPill
                label={STORE_STATUS_LABEL[store.status]}
                tone={STORE_STATUS_TONE[store.status]}
              />
            }
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Ventas del mes
                </p>
                <p className="mt-1 truncate font-display text-base font-semibold text-foreground sm:text-lg">
                  {formatCurrencyCompact(store.monthlySales)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">Stock</p>
                <p className="mt-1 truncate font-display text-base font-semibold text-foreground sm:text-lg">
                  {formatNumber(store.stockUnits)} u.
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">Pedidos</p>
                <p className="mt-1 truncate font-display text-base font-semibold text-foreground sm:text-lg">
                  {formatNumber(store.ordersCount)}
                </p>
              </div>
            </div>
            <Link
              to={`/tienda/${store.id}/general`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Ver panel de la tienda
              <ArrowRight className="size-3.5" />
            </Link>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
