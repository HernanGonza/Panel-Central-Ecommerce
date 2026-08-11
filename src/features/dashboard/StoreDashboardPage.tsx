import { Link, useParams } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Package,
  Percent,
  ScanLine,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { useAuth } from "@/auth/useAuth";
import { canViewPriceLookup, canViewReports, canViewStock } from "@/auth/permissions";
import { usePromotions } from "@/features/promotions/hooks";
import { useStores } from "@/features/stores/hooks";
import { formatDiscount, promotionScopeLabel, promotionStatus } from "@/data/types";

export function StoreDashboardPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { session } = useAuth();
  const role = session?.user.role;
  const { data: stores = [] } = useStores();
  const { data: promotions = [] } = usePromotions({ storeId });
  const store = stores.find((s) => s.id === storeId);
  const activePromotions = promotions.filter((p) => promotionStatus(p) === "vigente");

  const shortcuts = [
    {
      to: `/tienda/${storeId}/pedidos`,
      label: "Pedidos",
      icon: <ClipboardList className="size-5" />,
    },
    { to: `/tienda/${storeId}/catalogo`, label: "Catálogo", icon: <Package className="size-5" /> },
    ...(role && canViewPriceLookup(role)
      ? [
          {
            to: `/tienda/${storeId}/precios`,
            label: "Consulta de precios",
            icon: <ScanLine className="size-5" />,
          },
        ]
      : []),
    {
      to: `/tienda/${storeId}/promociones`,
      label: "Promociones",
      icon: <Percent className="size-5" />,
    },
    ...(role && canViewStock(role)
      ? [{ to: `/tienda/${storeId}/stock`, label: "Stock", icon: <Boxes className="size-5" /> }]
      : []),
    { to: `/tienda/${storeId}/clientes`, label: "Clientes", icon: <Users className="size-5" /> },
    ...(role && canViewReports(role)
      ? [
          {
            to: `/tienda/${storeId}/reportes`,
            label: "Reportes",
            icon: <BarChart3 className="size-5" />,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        title="Panel general"
        subtitle={store?.name ?? "Tienda"}
        action={
          store?.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={`Logo de ${store.name}`}
              className="size-11 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Store className="size-5" />
            </span>
          )
        }
      />

      <SectionCard title="Accesos directos">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)] transition-colors hover:bg-secondary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                {shortcut.icon}
              </span>
              <span className="text-sm font-medium text-foreground">{shortcut.label}</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Promociones activas"
        subtitle="Contale esto a los clientes en el mostrador"
      >
        <div className="space-y-3">
          {activePromotions.map((promo) => (
            <div key={promo.id} className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-foreground">
                    {promo.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{promo.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="size-3" />
                    {promotionScopeLabel(promo)}
                  </span>
                </div>
                <span className="shrink-0 font-display text-lg font-semibold text-accent">
                  {formatDiscount(promo)}
                </span>
              </div>
            </div>
          ))}
          {activePromotions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay promociones activas en este momento.
            </p>
          )}
        </div>
      </SectionCard>
    </>
  );
}
