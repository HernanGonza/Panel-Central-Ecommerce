import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts } from "@/features/products/hooks";
import { useLowStock } from "@/features/stock/hooks";
import { useStores } from "@/features/stores/hooks";
import { ProductDialog } from "@/features/products/ProductDialog";
import { LOW_STOCK_THRESHOLD } from "@/data/types";
import { formatNumber } from "@/lib/format";
import { TONE_COLOR, toneStyle } from "@/lib/tones";

export function StockView({ storeId }: { storeId?: string | undefined }) {
  const { data: products = [] } = useProducts({ storeId });
  const { data: lowStock = [] } = useLowStock(storeId);
  const { data: stores = [] } = useStores();

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;

  const byCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const product of products) {
      totals.set(product.category, (totals.get(product.category) ?? 0) + product.stock);
    }
    return [...totals.entries()]
      .map(([category, units]) => ({ category, units }))
      .sort((a, b) => b.units - a.units);
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Stock por categoría"
          subtitle={storeId ? "Unidades de esta tienda" : "Unidades consolidadas de todas las tiendas"}
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [`${formatNumber(Number(value))} u.`, "Stock"]}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="units" radius={[8, 8, 0, 0]} fill={TONE_COLOR.clay} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Bajo stock" subtitle="Alertas de reposición">
          <ul className="space-y-4">
            {lowStock.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  {!storeId && <p className="text-xs text-muted-foreground">{storeName(product.storeId)}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={toneStyle("gold")}>
                    {product.stock} u.
                  </span>
                  <ProductDialog product={product} />
                </div>
              </li>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin alertas de stock por ahora.</p>
            )}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Inventario"
        subtitle={storeId ? "Todos los productos de esta tienda" : "Todos los productos, todas las tiendas"}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                {!storeId && <TableHead>Tienda</TableHead>}
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ProductThumbnail name={product.name} imageUrl={product.imageUrl} />
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  {!storeId && <TableCell className="text-muted-foreground">{storeName(product.storeId)}</TableCell>}
                  <TableCell className="text-right">
                    <StatusPill
                      label={`${formatNumber(product.stock)} u.`}
                      tone={product.stock < LOW_STOCK_THRESHOLD ? "gold" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <ProductDialog product={product} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
