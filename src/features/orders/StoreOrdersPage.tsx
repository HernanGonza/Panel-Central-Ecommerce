import { useParams } from "react-router-dom";
import { OrdersView } from "@/features/orders/OrdersView";

export function StoreOrdersPage() {
  const { storeId } = useParams<{ storeId: string }>();
  return <OrdersView storeId={storeId} />;
}
