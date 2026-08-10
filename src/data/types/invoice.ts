export type InvoiceStatus = "pagado" | "pendiente";

export type PaymentMethod = "mercado_pago" | "transferencia" | "tarjeta" | "efectivo_local";

export interface Invoice {
  id: string;
  storeId: string;
  amount: number;
  status: InvoiceStatus;
  method: PaymentMethod;
  date: string;
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  mercado_pago: "Mercado Pago",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  efectivo_local: "Efectivo en local",
};
