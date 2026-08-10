import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { cn } from "@/lib/utils";

export function Barcode({ value, className }: { value: string; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    JsBarcode(svgRef.current, value, {
      format: "CODE128",
      width: 1.6,
      height: 44,
      fontSize: 12,
      margin: 6,
      background: "transparent",
      // Negro puro (no la marca) — mejor lectura del escáner y más seguro al imprimir.
      lineColor: "#000000",
    });
  }, [value]);

  return (
    <svg
      ref={svgRef}
      className={cn("w-full", className)}
      role="img"
      aria-label={`Código de barras ${value}`}
    />
  );
}
