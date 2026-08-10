import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/features/products/hooks";
import { useStores } from "@/features/stores/hooks";
import { NewProductDialog } from "@/features/products/NewProductDialog";
import { PRODUCT_CATEGORIES } from "@/data/fixtures/products";
import { LOW_STOCK_THRESHOLD } from "@/data/types";
import { formatCurrency, formatNumber } from "@/lib/format";

const ALL = "__all__";

export function ProductsView({ storeId }: { storeId?: string }) {
  const [category, setCategory] = useState<string>(ALL);
  const [storeFilter, setStoreFilter] = useState<string>(ALL);
  const { data: stores = [] } = useStores();

  const effectiveStoreId = storeId ?? (storeFilter === ALL ? undefined : storeFilter);
  const { data: products = [], isLoading } = useProducts({
    storeId: effectiveStoreId,
    category: category === ALL ? undefined : category,
  });

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;

  return (
    <>
      <PageHeader
        title={storeId ? "Catálogo" : "Productos"}
        subtitle={storeId ? "Productos de esta tienda" : "Catálogo consolidado de todas las tiendas"}
        action={<NewProductDialog storeId={storeId} />}
      />

      <SectionCard
        title={storeId ? "Catálogo" : "Catálogo de productos"}
        subtitle={storeId ? undefined : "Consolidado de todas las tiendas"}
        action={
          <div className="flex gap-2">
            {!storeId && (
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger size="sm" className="w-40">
                  <SelectValue placeholder="Tienda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas las tiendas</SelectItem>
                  {stores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas las categorías</SelectItem>
                {PRODUCT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              {!storeId && <TableHead>Tienda</TableHead>}
              <TableHead>Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                {!storeId && <TableCell className="text-muted-foreground">{storeName(product.storeId)}</TableCell>}
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-right">
                  <StatusPill
                    label={`${formatNumber(product.stock)} u.`}
                    tone={product.stock < LOW_STOCK_THRESHOLD ? "gold" : "success"}
                  />
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={storeId ? 4 : 5} className="py-10 text-center text-sm text-muted-foreground">
                  No hay productos que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>
    </>
  );
}
