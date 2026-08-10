import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ShippingProvider } from "@/data/types";

export function ShippingProviderDetailDialog({
  provider,
  onOpenChange,
}: {
  provider: ShippingProvider | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={provider !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {provider && (
          <>
            <DialogHeader>
              <DialogTitle>{provider.name}</DialogTitle>
            </DialogHeader>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Contacto</dt>
                <dd className="text-foreground">{provider.contactName || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Teléfono</dt>
                <dd className="text-foreground">{provider.contactPhone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="text-foreground">{provider.contactEmail || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Cobertura</dt>
                <dd className="text-foreground">{provider.coverageArea || "—"}</dd>
              </div>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
