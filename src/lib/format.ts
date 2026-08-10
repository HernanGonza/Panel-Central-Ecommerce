import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** "$ 48,2 M" — para KPIs donde el monto completo ocuparía demasiado lugar. */
export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$ ${(value / 1_000_000).toLocaleString("es-AR", { maximumFractionDigits: 1 })} M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$ ${(value / 1_000).toLocaleString("es-AR", { maximumFractionDigits: 1 })} mil`;
  }
  return formatCurrency(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) return "Hoy";
  return `Hace ${formatDistanceToNow(date, { locale: es })}`;
}
