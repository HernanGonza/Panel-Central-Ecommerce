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
            action={<StatusPill label={STORE_STATUS_LABEL[store.status]} tone={STORE_STATUS_TONE[store.status]} />}
          >
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Ventas del mes</p>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">
                  {formatCurrencyCompact(store.monthlySales)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock</p>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">
                  {formatNumber(store.stockUnits)} u.
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pedidos</p>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">
                  {formatNumber(store.ordersCount)}
                </p>
              </div>
            </div>
            <Link
              to={`/tienda/${store.id}/pedidos`}
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
