import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StockView } from "@/features/stock/StockView";

export function StoreStockPage() {
  const { storeId } = useParams<{ storeId: string }>();
  return (
    <>
      <PageHeader title="Stock" subtitle="Inventario de esta tienda" />
      <StockView storeId={storeId} />
    </>
  );
}
