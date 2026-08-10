import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import { StatusPill } from "@/components/shared/StatusPill";
import { Barcode } from "@/components/shared/Barcode";
import { useStores } from "@/features/stores/hooks";
import { LOW_STOCK_THRESHOLD, type Product } from "@/data/types";
import { formatCurrency, formatNumber } from "@/lib/format";

export function ProductDetailDialog({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: stores = [] } = useStores();
  const storeName = stores.find((s) => s.id === product?.storeId)?.name;

  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ProductThumbnail name={product.name} imageUrl={product.imageUrl} className="size-20 text-base" />
                <div>
                  <p className="text-xs text-muted-foreground">{storeName ?? product.storeId}</p>
                  <p className="mt-0.5 font-display text-lg font-semibold text-foreground">
                    {formatCurrency(product.price)}
                  </p>
                  <StatusPill
                    label={`${formatNumber(product.stock)} u. en stock`}
                    tone={product.stock < LOW_STOCK_THRESHOLD ? "gold" : "success"}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Categoría</dt>
                  <dd className="text-foreground">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Proveedor</dt>
                  <dd className="text-foreground">{product.supplier}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Costo</dt>
                  <dd className="text-foreground">{formatCurrency(product.cost)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Vendidos históricos</dt>
                  <dd className="text-foreground">{formatNumber(product.unitsSold)} u.</dd>
                </div>
              </dl>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Código de barras</p>
                <div className="rounded-lg border border-border bg-card p-2">
                  <Barcode value={product.barcode} />
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
