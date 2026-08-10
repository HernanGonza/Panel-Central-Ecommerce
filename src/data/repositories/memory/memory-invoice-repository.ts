import type { InvoiceRepository } from "@/data/repositories/interfaces";
import { invoices, paymentMethodStats } from "@/data/fixtures/invoices";
import { delay } from "@/data/repositories/memory/delay";

export const memoryInvoiceRepository: InvoiceRepository = {
  async list(filter) {
    const result = filter?.storeId
      ? invoices.filter((i) => i.storeId === filter.storeId)
      : invoices;
    return delay([...result]);
  },
  async paymentMethodStats() {
    return delay(paymentMethodStats);
  },
};
