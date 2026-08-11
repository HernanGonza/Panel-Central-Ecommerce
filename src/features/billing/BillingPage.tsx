import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { AnimatedBar } from "@/components/shared/AnimatedBar";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useInvoices } from "@/features/billing/hooks";
import { useStores } from "@/features/stores/hooks";
import { INVOICE_STATUS_TONE } from "@/lib/status-tones";
import { PAYMENT_METHOD_LABEL, type PaymentMethod } from "@/data/types";
import { formatCurrency, formatCurrencyCompact, formatRelativeDate } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

const METHOD_COLOR = [TONE_COLOR.clay, TONE_COLOR.teal, TONE_COLOR.gold, TONE_COLOR.success];
const METHOD_ORDER = Object.keys(PAYMENT_METHOD_LABEL) as PaymentMethod[];

export function BillingPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { data: invoices = [] } = useInvoices({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const { data: stores = [] } = useStores();

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;

  const facturado = invoices
    .filter((i) => i.status === "pagado")
    .reduce((sum, i) => sum + i.amount, 0);
  const pendiente = invoices
    .filter((i) => i.status === "pendiente")
    .reduce((sum, i) => sum + i.amount, 0);

  const methodTotals = new Map<PaymentMethod, number>();
  for (const invoice of invoices) {
    methodTotals.set(invoice.method, (methodTotals.get(invoice.method) ?? 0) + invoice.amount);
  }
  const methodGrandTotal = invoices.reduce((sum, i) => sum + i.amount, 0);
  const methodStats = METHOD_ORDER.map((method) => {
    const amount = methodTotals.get(method) ?? 0;
    return {
      method,
      amount,
      pct: methodGrandTotal > 0 ? Math.round((amount / methodGrandTotal) * 100) : 0,
    };
  }).filter((stat) => stat.amount > 0);

  return (
    <>
      <PageHeader title="Facturación" subtitle="Medios de pago y comprobantes por tienda" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Facturado este mes" value={formatCurrencyCompact(facturado)} tone="clay" />
        <StatCard label="Pendiente de cobro" value={formatCurrencyCompact(pendiente)} tone="gold" />
        <StatCard label="Medios activos" value={String(methodStats.length)} tone="success" />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <SectionCard
          title="Medios de pago"
          subtitle="Participación sobre el total facturado"
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
            {methodStats.map((stat, i) => (
              <div key={stat.method}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{PAYMENT_METHOD_LABEL[stat.method]}</span>
                  <span className="font-semibold text-foreground">{stat.pct} %</span>
                </div>
                <AnimatedBar pct={stat.pct} color={METHOD_COLOR[i % METHOD_COLOR.length]!} />
              </div>
            ))}
            {methodStats.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay comprobantes en el rango elegido.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Comprobantes recientes">
          <ul className="space-y-4">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {storeName(invoice.storeId)} · {formatRelativeDate(invoice.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill
                    label={invoice.status === "pagado" ? "Pagado" : "Pendiente"}
                    tone={INVOICE_STATUS_TONE[invoice.status]}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
              </li>
            ))}
            {invoices.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay comprobantes en el rango elegido.
              </p>
            )}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
