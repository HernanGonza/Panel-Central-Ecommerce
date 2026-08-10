import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { useInvoices, usePaymentMethodStats } from "@/features/billing/hooks";
import { useStores } from "@/features/stores/hooks";
import { INVOICE_STATUS_TONE } from "@/lib/status-tones";
import { PAYMENT_METHOD_LABEL } from "@/data/types";
import { formatCurrency, formatCurrencyCompact, formatRelativeDate } from "@/lib/format";
import { TONE_COLOR } from "@/lib/tones";

const METHOD_COLOR = [TONE_COLOR.clay, TONE_COLOR.teal, TONE_COLOR.gold, TONE_COLOR.success];

export function BillingPage() {
  const { data: invoices = [] } = useInvoices();
  const { data: methodStats = [] } = usePaymentMethodStats();
  const { data: stores = [] } = useStores();

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;

  const facturado = invoices.filter((i) => i.status === "pagado").reduce((sum, i) => sum + i.amount, 0);
  const pendiente = invoices.filter((i) => i.status === "pendiente").reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      <PageHeader title="Facturación" subtitle="Medios de pago y comprobantes por tienda" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Facturado este mes" value={formatCurrencyCompact(facturado)} tone="clay" />
        <StatCard label="Pendiente de cobro" value={formatCurrencyCompact(pendiente)} tone="gold" />
        <StatCard label="Medios activos" value={String(methodStats.length)} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Medios de pago" subtitle="Participación sobre el total facturado">
          <div className="space-y-4">
            {methodStats.map((stat, i) => (
              <div key={stat.method}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{PAYMENT_METHOD_LABEL[stat.method]}</span>
                  <span className="font-semibold text-foreground">{stat.pct} %</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${stat.pct}%`, backgroundColor: METHOD_COLOR[i % METHOD_COLOR.length] }}
                  />
                </div>
              </div>
            ))}
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
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(invoice.amount)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
