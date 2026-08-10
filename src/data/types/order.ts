export type OrderStatus = "pendiente" | "preparando" | "enviado" | "entregado";

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
  items: OrderItem[];
  total: number;
  createdAt: string;
  /** Vendedor/gerente que cargó la venta — vacío para pedidos online. */
  sellerId?: string | undefined;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
};

export const ORDER_STATUS_ORDER: OrderStatus[] = ["pendiente", "preparando", "enviado", "entregado"];
