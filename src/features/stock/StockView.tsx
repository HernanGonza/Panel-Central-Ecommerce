import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { useProducts } from "@/features/products/hooks";
import { useLowStock } from "@/features/stock/hooks";
import { useStores } from "@/features/stores/hooks";
import { formatNumber } from "@/lib/format";
import { TONE_COLOR, toneStyle } from "@/lib/tones";

export function StockView({ storeId }: { storeId?: string }) {
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
    <>
      <PageHeader
        title="Stock"
        subtitle={storeId ? "Inventario de esta tienda" : "Inventario consolidado y alertas por tienda"}
      />

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
                  formatter={(value: number) => [`${formatNumber(value)} u.`, "Stock"]}
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
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={toneStyle("gold")}
                >
                  {product.stock} u.
                </span>
              </li>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin alertas de stock por ahora.</p>
            )}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
