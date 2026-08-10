import { useParams } from "react-router-dom";
import { ProductsView } from "@/features/products/ProductsView";

export function CatalogPage() {
  const { storeId } = useParams<{ storeId: string }>();
  return <ProductsView storeId={storeId} />;
}
