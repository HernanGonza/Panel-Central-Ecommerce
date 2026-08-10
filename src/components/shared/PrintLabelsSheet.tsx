import { createPortal } from "react-dom";
import { Barcode } from "@/components/shared/Barcode";
import { formatCurrency } from "@/lib/format";

export interface PrintLabelProduct {
  name: string;
  price: number;
  barcode: string;
}

/**
 * Se renderiza siempre (oculto vía CSS, ver globals.css) para que esté listo
 * en el DOM en el momento en que se dispare `window.print()`. No hace falta
 * montarlo/desmontarlo — cuando `quantity` es 0 no imprime nada.
 */
export function PrintLabelsSheet({
  product,
  quantity,
}: {
  product: PrintLabelProduct | null;
  quantity: number;
}) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot || !product || quantity <= 0) return null;

  return createPortal(
    <div className="grid grid-cols-3 gap-2 p-4">
      {Array.from({ length: quantity }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1 border border-dashed border-black/40 p-2"
        >
          <p className="w-full truncate text-center text-[10px] font-semibold text-black">
            {product.name}
          </p>
          <Barcode value={product.barcode} />
          <p className="text-xs font-bold text-black">{formatCurrency(product.price)}</p>
        </div>
      ))}
    </div>,
    printRoot,
  );
}
