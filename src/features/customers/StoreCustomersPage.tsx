import { useParams } from "react-router-dom";
import { CustomersView } from "@/features/customers/CustomersView";

export function StoreCustomersPage() {
  const { storeId } = useParams<{ storeId: string }>();
  return <CustomersView storeId={storeId} />;
}
