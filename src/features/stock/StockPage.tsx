import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockView } from "@/features/stock/StockView";
import { useStores } from "@/features/stores/hooks";

const CONSOLIDATED = "__all__";

export function StockPage() {
  const [tab, setTab] = useState(CONSOLIDATED);
  const { data: stores = [] } = useStores();

  return (
    <>
      <PageHeader title="Stock" subtitle="Inventario consolidado y por tienda" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value={CONSOLIDATED}>Consolidado</TabsTrigger>
          {stores.map((store) => (
            <TabsTrigger key={store.id} value={store.id}>
              {store.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={CONSOLIDATED} className="mt-4">
          <StockView />
        </TabsContent>
        {stores.map((store) => (
          <TabsContent key={store.id} value={store.id} className="mt-4">
            <StockView storeId={store.id} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
