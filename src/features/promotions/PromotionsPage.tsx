import { useParams } from "react-router-dom";
import { Power, PowerOff } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { usePromotions, useUpdatePromotion } from "@/features/promotions/hooks";
import { PromotionDialog } from "@/features/promotions/PromotionDialog";
import { useAuth } from "@/auth/useAuth";
import { canManagePromotions } from "@/auth/permissions";
import { PROMOTION_STATUS_LABEL, formatDiscount, promotionStatus } from "@/data/types";
import { PROMOTION_STATUS_TONE } from "@/lib/status-tones";

function formatDateRange(startDate: string | undefined, endDate: string | undefined): string | null {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
  if (startDate && endDate) return `${fmt(startDate)} – ${fmt(endDate)}`;
  if (startDate) return `Desde ${fmt(startDate)}`;
  if (endDate) return `Hasta ${fmt(endDate)}`;
  return null;
}

export function PromotionsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { session } = useAuth();
  const canManage = session ? canManagePromotions(session.user.role) : false;
  const { data: promotions = [] } = usePromotions({ storeId });
  const updatePromotion = useUpdatePromotion();

  if (!storeId) return null;

  return (
    <>
      <PageHeader
        title="Promociones"
        subtitle="Descuentos activos para esta tienda"
        action={canManage ? <PromotionDialog storeId={storeId} /> : undefined}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {promotions.map((promotion) => {
          const status = promotionStatus(promotion);
          const dateRange = formatDateRange(promotion.startDate, promotion.endDate);
          return (
            <SectionCard
              key={promotion.id}
              title={promotion.title}
              subtitle={dateRange ?? "Sin fecha límite"}
              action={<StatusPill label={PROMOTION_STATUS_LABEL[status]} tone={PROMOTION_STATUS_TONE[status]} />}
            >
              <p className="text-sm text-muted-foreground">{promotion.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-foreground">
                  {formatDiscount(promotion)}
                </span>
                {canManage && (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updatePromotion.mutate({ id: promotion.id, patch: { active: !promotion.active } })
                      }
                    >
                      {promotion.active ? (
                        <>
                          <PowerOff className="size-3.5" />
                          Apagar
                        </>
                      ) : (
                        <>
                          <Power className="size-3.5" />
                          Encender
                        </>
                      )}
                    </Button>
                    <PromotionDialog storeId={storeId} promotion={promotion} />
                  </div>
                )}
              </div>
            </SectionCard>
          );
        })}
        {promotions.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía no hay promociones cargadas para esta tienda.</p>
        )}
      </div>
    </>
  );
}
