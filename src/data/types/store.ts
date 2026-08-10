export type StoreStatus = "activa" | "en_incorporacion" | "inactiva";

export interface Store {
  id: string;
  name: string;
  zone: string;
  status: StoreStatus;
  monthlySales: number;
  stockUnits: number;
  ordersCount: number;
}

export const STORE_STATUS_LABEL: Record<StoreStatus, string> = {
  activa: "Activa",
  en_incorporacion: "En incorporación",
  inactiva: "Inactiva",
};
