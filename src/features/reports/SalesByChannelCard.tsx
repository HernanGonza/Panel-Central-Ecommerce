import { useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { AnimatedBar } from "@/components/shared/AnimatedBar";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useOrders } from "@/features/orders/hooks";
import { ORDER_CHANNEL_LABEL, ORDER_CHANNEL_ORDER } from "@/data/types";
import { ORDER_CHANNEL_TONE } from "@/lib/status-tones";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

export function SalesByChannelCard({ storeId }: { storeId?: string | undefined }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { data: orders = [] } = useOrders({
    storeId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const channelBreakdown = useMemo(() => {
    const totals = new Map<string, { count: number; total: number }>();
    for (const o of orders) {
      const entry = totals.get(o.channel) ?? { count: 0, total: 0 };
      entry.count += 1;
      entry.total += o.total;
      totals.set(o.channel, entry);
    }
    const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
    return ORDER_CHANNEL_ORDER.map((channel) => {
      const entry = totals.get(channel) ?? { count: 0, total: 0 };
      return {
        channel,
        count: entry.count,
        total: entry.total,
        pct: grandTotal > 0 ? (entry.total / grandTotal) * 100 : 0,
      };
    });
  }, [orders]);

  return (
    <SectionCard
      title="Ventas por canal"
      subtitle="En local vs. online"
      action={
        <DateRangeFilter
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />
      }
    >
      <div className="space-y-4">
        {channelBreakdown.map((c) => (
          <div key={c.channel}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">{ORDER_CHANNEL_LABEL[c.channel]}</span>
              <span className="font-semibold text-foreground">
                {formatCurrencyCompact(c.total)} · {formatNumber(c.count)}{" "}
                {c.count === 1 ? "venta" : "ventas"}
              </span>
            </div>
            <AnimatedBar pct={c.pct} color={TONE_COLOR[ORDER_CHANNEL_TONE[c.channel]]} />
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay ventas en el rango elegido.</p>
        )}
      </div>
    </SectionCard>
  );
}
