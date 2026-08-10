import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Supplier } from "@/data/types";

export function SupplierDetailDialog({
  supplier,
  onOpenChange,
}: {
  supplier: Supplier | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={supplier !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {supplier && (
          <>
            <DialogHeader>
              <DialogTitle>{supplier.name}</DialogTitle>
            </DialogHeader>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Contacto</dt>
                <dd className="text-foreground">{supplier.contactName || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Teléfono</dt>
                <dd className="text-foreground">{supplier.contactPhone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="text-foreground">{supplier.contactEmail || "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Dirección</dt>
                <dd className="text-foreground">{supplier.address || "—"}</dd>
              </div>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
