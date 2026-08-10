import { useParams } from "react-router-dom";
import { OrdersView } from "@/features/orders/OrdersView";
import { NewOrderDialog } from "@/features/orders/NewOrderDialog";

export function StoreOrdersPage() {
  const { storeId } = useParams<{ storeId: string }>();
  if (!storeId) return null;
  return <OrdersView storeId={storeId} headerAction={<NewOrderDialog storeId={storeId} />} />;
}
