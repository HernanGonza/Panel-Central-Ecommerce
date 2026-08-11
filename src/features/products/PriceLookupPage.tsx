import { useState } from "react";
import { useParams } from "react-router-dom";
import { ScanLine } from "lucide-react";
import { BarcodeScannerDialog } from "@/components/shared/BarcodeScannerDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/features/products/hooks";
import { LOW_STOCK_THRESHOLD, type Product } from "@/data/types";
import { formatCurrency, formatNumber } from "@/lib/format";

export function PriceLookupPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: products = [] } = useProducts({ storeId });
  const [found, setFound] = useState<Product | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);

  function handleScan(code: string) {
    const product = products.find((p) => p.barcode === code);
    setFound(product ?? null);
    setNotFoundCode(product ? null : code);
  }

  return (
    <>
      <PageHeader
        title="Consulta de precios"
        subtitle="Escaneá un código de barras para ver precio y stock"
      />

      <SectionCard title="Escanear producto" subtitle="Apuntá la cámara al código de barras">
        <div className="flex flex-col items-center gap-6 py-6">
          <BarcodeScannerDialog
            onDetected={handleScan}
            trigger={
              <Button type="button" size="lg" className="h-14 px-8 text-base">
                <ScanLine className="size-5" />
                Escanear código
              </Button>
            }
          />

          {found && (
            <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <ProductThumbnail
                name={found.name}
                imageUrl={found.imageUrl}
                className="size-16 text-base"
              />
              <p className="font-display text-lg font-semibold text-foreground">{found.name}</p>
              <p className="font-display text-3xl font-semibold text-foreground">
                {formatCurrency(found.price)}
              </p>
              <StatusPill
                label={`${formatNumber(found.stock)} u. en stock`}
                tone={found.stock < LOW_STOCK_THRESHOLD ? "gold" : "success"}
              />
            </div>
          )}

          {notFoundCode && (
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              Ningún producto de esta tienda tiene el código {notFoundCode}.
            </p>
          )}
        </div>
      </SectionCard>
    </>
  );
}
