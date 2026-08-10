import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStores } from "@/features/stores/hooks";
import type { Customer } from "@/data/types";
import { formatCurrency, formatNumber, formatRelativeDate } from "@/lib/format";

export function CustomerDetailDialog({
  customer,
  onOpenChange,
}: {
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: stores = [] } = useStores();
  const storeNames = customer
    ? customer.storeIds.map((id) => stores.find((s) => s.id === id)?.name ?? id).join(", ")
    : "";

  return (
    <Dialog open={customer !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {customer && (
          <>
            <DialogHeader>
              <DialogTitle>{customer.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="text-foreground">{customer.email || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Teléfono</dt>
                  <dd className="text-foreground">{customer.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">DNI/CUIT</dt>
                  <dd className="text-foreground">{customer.docId || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tiendas</dt>
                  <dd className="text-foreground">{storeNames || "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Dirección de envío</dt>
                  <dd className="text-foreground">{customer.address || "Sin dirección cargada"}</dd>
                </div>
              </dl>

              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Compras históricas</p>
                    <p className="mt-0.5 font-display text-lg font-semibold text-foreground">
                      {formatNumber(customer.purchasesCount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Gasto total</p>
                    <p className="mt-0.5 font-display text-lg font-semibold text-foreground">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Última compra: {formatRelativeDate(customer.lastPurchaseAt)}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
