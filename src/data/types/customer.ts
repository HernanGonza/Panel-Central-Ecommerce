export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** DNI o CUIT — la base de clientes se consolida por email y DNI/CUIT. */
  docId: string;
  /** Necesaria para envíos a domicilio. */
  address?: string | undefined;
  storeIds: string[];
  purchasesCount: number;
  totalSpent: number;
  lastPurchaseAt: string;
}
