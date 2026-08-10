import { useParams } from "react-router-dom";
import { StockView } from "@/features/stock/StockView";

export function StoreStockPage() {
  const { storeId } = useParams<{ storeId: string }>();
  return <StockView storeId={storeId} />;
}
