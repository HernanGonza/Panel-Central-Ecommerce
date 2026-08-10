export type DiscountType = "percentage" | "fixed";

export type PromotionStatus = "vigente" | "programada" | "vencida" | "apagada";

export interface Promotion {
  id: string;
  storeId: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  /** Si no se define ninguna fecha, la promo se prende/apaga solo con el botón manual. */
  startDate?: string | undefined;
  endDate?: string | undefined;
  /** Llave manual — si está apagada, no se muestra aunque esté dentro de fecha. */
  active: boolean;
}

export const DISCOUNT_TYPE_LABEL: Record<DiscountType, string> = {
  percentage: "% de descuento",
  fixed: "Monto fijo",
};

export const PROMOTION_STATUS_LABEL: Record<PromotionStatus, string> = {
  vigente: "Vigente",
  programada: "Programada",
  vencida: "Vencida",
  apagada: "Apagada",
};

export function formatDiscount(promotion: Pick<Promotion, "discountType" | "discountValue">): string {
  return promotion.discountType === "percentage"
    ? `${promotion.discountValue}% OFF`
    : `$${promotion.discountValue.toLocaleString("es-AR")} OFF`;
}

/**
 * `active` es la llave manual. Si hay fechas cargadas, además se compara contra
 * "ahora" para saber si ya empezó / ya venció, sin necesidad de tocar `active`.
 */
export function promotionStatus(promotion: Pick<Promotion, "active" | "startDate" | "endDate">): PromotionStatus {
  if (!promotion.active) return "apagada";
  const now = Date.now();
  if (promotion.startDate && now < new Date(promotion.startDate).getTime()) return "programada";
  if (promotion.endDate && now > new Date(promotion.endDate).getTime()) return "vencida";
  return "vigente";
}
