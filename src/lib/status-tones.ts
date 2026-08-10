import type { OrderStatus } from "@/data/types/order";
import type { InvoiceStatus } from "@/data/types/invoice";
import type { Role, UserStatus } from "@/data/types/user";
import type { StoreStatus } from "@/data/types/store";
import type { PromotionStatus } from "@/data/types/promotion";
import type { Tone } from "@/lib/tones";

export const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  pendiente: "clay",
  preparando: "gold",
  enviado: "teal",
  entregado: "success",
};

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, Tone> = {
  pagado: "success",
  pendiente: "gold",
};

export const ROLE_TONE: Record<Role, Tone> = {
  dueño: "clay",
  administrador: "clay",
  gerente: "teal",
  vendedor: "gold",
};

export const USER_STATUS_TONE: Record<UserStatus, Tone> = {
  activo: "success",
  invitado: "neutral",
};

export const STORE_STATUS_TONE: Record<StoreStatus, Tone> = {
  activa: "success",
  en_incorporacion: "gold",
  inactiva: "neutral",
};

export const PROMOTION_STATUS_TONE: Record<PromotionStatus, Tone> = {
  vigente: "success",
  programada: "teal",
  vencida: "neutral",
  apagada: "neutral",
};
