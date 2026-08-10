import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import { ScanLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BarcodeScannerDialog({
  onDetected,
  trigger,
}: {
  onDetected: (code: string) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !viewportRef.current) return;

    let cancelled = false;

    function handleDetected(result: { codeResult: { code: string | null } }) {
      const code = result.codeResult.code;
      if (!code || cancelled) return;
      cancelled = true;
      onDetected(code);
      setOpen(false);
    }

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: viewportRef.current,
          constraints: { facingMode: "environment" },
        },
        decoder: { readers: ["code_128_reader", "ean_reader", "ean_8_reader"] },
        locate: true,
      },
      (err) => {
        if (cancelled) return;
        if (err) {
          setError("No pudimos acceder a la cámara. Revisá los permisos del navegador.");
          return;
        }
        Quagga.start();
        Quagga.onDetected(handleDetected);
      },
    );

    return () => {
      cancelled = true;
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, [open, onDetected]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="icon" className="size-9 shrink-0">
            <ScanLine className="size-4" />
            <span className="sr-only">Escanear código de barras</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escanear código de barras</DialogTitle>
        </DialogHeader>
        {error ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{error}</p>
        ) : (
          <div
            ref={viewportRef}
            className="relative aspect-video overflow-hidden rounded-xl bg-black [&>video]:h-full [&>video]:w-full [&>video]:object-cover [&>canvas]:hidden"
          />
        )}
        <p className="text-center text-xs text-muted-foreground">
          Apuntá la cámara al código de barras del producto.
        </p>
      </DialogContent>
    </Dialog>
  );
}
