import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusPill } from "@/components/shared/StatusPill";
import { useCustomer } from "@/features/customers/hooks";
import { useStores } from "@/features/stores/hooks";
import { ORDER_STATUS_LABEL, type Order } from "@/data/types";
import { ORDER_STATUS_TONE } from "@/lib/status-tones";
import { formatCurrency, formatNumber, formatRelativeDate } from "@/lib/format";

export function OrderDetailDialog({
  order,
  onOpenChange,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: customer } = useCustomer(order?.customerId);
  const { data: stores = [] } = useStores();
  const storeName = stores.find((s) => s.id === order?.storeId)?.name;

  return (
    <Dialog open={order !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>Pedido {order.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <StatusPill
                  label={ORDER_STATUS_LABEL[order.status]}
                  tone={ORDER_STATUS_TONE[order.status]}
                />
                <span className="font-display text-lg font-semibold text-foreground">
                  {formatCurrency(order.total)}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Tienda</dt>
                  <dd className="text-foreground">{storeName ?? order.storeId}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Fecha</dt>
                  <dd className="text-foreground">{formatRelativeDate(order.createdAt)}</dd>
                </div>
              </dl>

              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-medium text-muted-foreground">Cliente</p>
                <p className="mt-1 font-display text-base font-semibold text-foreground">
                  {order.customerName}
                </p>
                {customer ? (
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <p>{customer.email}</p>
                    <p>{customer.phone}</p>
                    <p>DNI/CUIT {customer.docId}</p>
                    <p className="pt-1 text-xs">
                      {formatNumber(customer.purchasesCount)} compras históricas ·{" "}
                      {formatCurrency(customer.totalSpent)} acumulados
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Cliente ocasional, sin ficha registrada.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
