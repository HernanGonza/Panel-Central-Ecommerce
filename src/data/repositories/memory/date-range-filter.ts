import type { DateRangeFilter } from "@/data/repositories/interfaces";

/** `dateFrom`/`dateTo` son fechas `YYYY-MM-DD` sin hora — `dateTo` incluye el día entero. */
export function withinDateRange(iso: string, filter?: DateRangeFilter): boolean {
  const time = new Date(iso).getTime();
  if (filter?.dateFrom && time < new Date(filter.dateFrom).getTime()) return false;
  if (filter?.dateTo && time > new Date(filter.dateTo).getTime() + 24 * 60 * 60 * 1000 - 1) {
    return false;
  }
  return true;
}
