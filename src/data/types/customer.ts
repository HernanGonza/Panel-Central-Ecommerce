export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** DNI o CUIT — la base de clientes se consolida por email y DNI/CUIT. */
  docId: string;
  storeIds: string[];
  purchasesCount: number;
  totalSpent: number;
  lastPurchaseAt: string;
}
