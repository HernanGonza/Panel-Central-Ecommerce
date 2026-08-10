import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { useSalesByCategory, useTopSellingProducts } from "@/features/reports/hooks";
import { useStores } from "@/features/stores/hooks";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

const CATEGORY_COLOR = [TONE_COLOR.clay, TONE_COLOR.teal, TONE_COLOR.gold, TONE_COLOR.success];

export function ReportsPage() {
  const { data: categories = [] } = useSalesByCategory();
  const { data: topProducts = [] } = useTopSellingProducts();
  const { data: stores = [] } = useStores();

  const maxSales = Math.max(1, ...stores.map((s) => s.monthlySales));
  const leader = categories[0];

  return (
    <>
      <PageHeader title="Reportes" subtitle="Comparativa de ventas entre tiendas" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Ventas por categoría" subtitle="Participación sobre el total del mes">
          <div className="flex items-center gap-6">
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="pct"
                    nameKey="category"
                    innerRadius={52}
                    outerRadius={78}
                    startAngle={90}
                    endAngle={-270}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                  >
                    {categories.map((entry, i) => (
                      <Cell key={entry.category} fill={CATEGORY_COLOR[i % CATEGORY_COLOR.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} %`, name]}
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {leader && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-xl font-semibold text-foreground">{leader.pct} %</span>
                  <span className="text-[11px] text-muted-foreground">{leader.category}</span>
                </div>
              )}
            </div>
            <ul className="flex-1 space-y-2.5">
              {categories.map((c, i) => (
                <li key={c.category} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="size-2.5 rounded-sm"
                      style={{ backgroundColor: CATEGORY_COLOR[i % CATEGORY_COLOR.length] }}
                    />
                    {c.category}
                  </span>
                  <span className="font-semibold text-foreground">{c.pct} %</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Ventas por tienda" subtitle="Comparativa del mes">
          <div className="space-y-4">
            {stores.map((store, i) => (
              <div key={store.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{store.name}</span>
                  <span className="font-semibold text-foreground">{formatCurrencyCompact(store.monthlySales)}</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(store.monthlySales / maxSales) * 100}%`,
                      backgroundColor: TONE_COLOR.clay,
                      opacity: 0.5 + i * 0.15,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Productos más vendidos" subtitle="Unidades del mes" className="lg:col-span-2">
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topProducts.map((p, i) => (
              <li key={p.product} className="flex items-center gap-3">
                <span className="font-display text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.product}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(p.units)} u.</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </>
  );
}
