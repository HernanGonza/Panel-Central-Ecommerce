export interface Customer {
  id: string;
  name: string;
  storeIds: string[];
  purchasesCount: number;
  totalSpent: number;
  lastPurchaseAt: string;
}
