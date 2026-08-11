import { useState } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { AnimatedBar } from "@/components/shared/AnimatedBar";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useOrderStatusCounts } from "@/features/orders/hooks";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER } from "@/data/types";
import { ORDER_STATUS_TONE } from "@/lib/status-tones";
import { TONE_COLOR } from "@/lib/tones";

export function OrderStatusBreakdownCard({ storeId }: { storeId?: string | undefined }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { data: statusCounts } = useOrderStatusCounts({
    storeId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const total = statusCounts ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : 0;

  return (
    <SectionCard
      title="Pedidos por estado"
      subtitle="Sobre los pedidos registrados de esta tienda"
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
        {ORDER_STATUS_ORDER.map((status) => {
          const value = statusCounts?.[status] ?? 0;
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={status}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{ORDER_STATUS_LABEL[status]}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
              <AnimatedBar pct={pct} color={TONE_COLOR[ORDER_STATUS_TONE[status]]} />
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
