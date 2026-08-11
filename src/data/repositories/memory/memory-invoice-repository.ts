import type { InvoiceRepository } from "@/data/repositories/interfaces";
import { invoices as invoiceFixtures } from "@/data/fixtures/invoices";
import type { Invoice } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";
import { withinDateRange } from "@/data/repositories/memory/date-range-filter";

const invoices: Invoice[] = [...invoiceFixtures];
let nextNum = Math.max(...invoices.map((i) => parseInt(i.id.replace("FC-", ""), 10))) + 1;

export const memoryInvoiceRepository: InvoiceRepository = {
  async list(filter) {
    let result = filter?.storeId ? invoices.filter((i) => i.storeId === filter.storeId) : invoices;
    if (filter?.dateFrom || filter?.dateTo) {
      result = result.filter((i) => withinDateRange(i.date, filter));
    }
    return delay(
      [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    );
  },
  async getByOrderId(orderId) {
    return delay(invoices.find((i) => i.orderId === orderId));
  },
  async create(input) {
    const invoice: Invoice = { ...input, id: `FC-${nextNum++}` };
    invoices.unshift(invoice);
    return delay(invoice);
  },
};
