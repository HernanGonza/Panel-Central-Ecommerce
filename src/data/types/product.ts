export interface Product {
  id: string;
  name: string;
  category: string;
  storeId: string;
  price: number;
  stock: number;
}

export const LOW_STOCK_THRESHOLD = 10;
