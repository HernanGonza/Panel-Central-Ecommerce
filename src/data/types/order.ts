export type OrderStatus = "pendiente" | "preparando" | "enviado" | "entregado";

/** Canal por el que entró la venta. Los pedidos online no tienen `sellerId`. */
export type OrderChannel = "local" | "online";

export interface OrderItem {
  productId: string;
  /** Nombre al momento de la venta — si el producto cambia de nombre después, el pedido conserva el histórico. */
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  channel: OrderChannel;
  items: OrderItem[];
  total: number;
  createdAt: string;
  /** Vendedor/gerente que cargó la venta — vacío en pedidos online. */
  sellerId?: string | undefined;
}

export const ORDER_CHANNEL_LABEL: Record<OrderChannel, string> = {
  local: "En local",
  online: "Online",
};

export const ORDER_CHANNEL_ORDER: OrderChannel[] = ["local", "online"];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
};

export const ORDER_STATUS_ORDER: OrderStatus[] = [
  "pendiente",
  "preparando",
  "enviado",
  "entregado",
];
