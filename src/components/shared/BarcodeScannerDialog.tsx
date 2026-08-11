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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BarcodeScannerDialog({
  onDetected,
  trigger,
}: {
  onDetected: (code: string) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const supportsCamera =
    typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setDevices([]);
      setDeviceId(null);
      setError(null);
    }
  }

  useEffect(() => {
    if (!open || !viewportRef.current || !supportsCamera) return;

    let cancelled = false;

    function handleDetected(result: { codeResult: { code: string | null } }) {
      const code = result.codeResult.code;
      if (!code || cancelled) return;
      cancelled = true;
      onDetected(code);
      setOpen(false);
    }

    function onError(err: unknown) {
      console.error("No se pudo iniciar el escáner de código de barras", err);
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError") {
        setError(
          "La cámara está bloqueada para este sitio. Habilitala desde el ícono de cámara en la barra de direcciones y volvé a intentar.",
        );
      } else {
        setError("No pudimos acceder a la cámara. Revisá los permisos del navegador.");
      }
    }

    function start(constraints: MediaTrackConstraints, allowFallback: boolean) {
      let settled = false;

      function handleFailure(err: unknown) {
        if (cancelled || settled) return;
        settled = true;
        // Laptops usually have no "environment"-facing camera; fall back to
        // whatever default camera is available (e.g. the built-in webcam).
        if (allowFallback) {
          start({}, false);
          return;
        }
        onError(err);
      }

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: viewportRef.current ?? undefined,
            constraints,
          },
          decoder: { readers: ["code_128_reader", "ean_reader", "ean_8_reader"] },
          locate: true,
        },
        (err) => {
          if (cancelled || settled) return;
          if (err) {
            handleFailure(err);
            return;
          }
          settled = true;
          Quagga.start();
          Quagga.onDetected(handleDetected);
          navigator.mediaDevices
            ?.enumerateDevices()
            .then((list) => {
              if (cancelled) return;
              setDevices(list.filter((d) => d.kind === "videoinput"));
            })
            .catch(() => undefined);
        },
      )?.catch((err) => {
        // Some Quagga2 failure paths (e.g. permission denied) reject the
        // returned promise without ever invoking the callback above.
        handleFailure(err);
      });
    }

    start(
      deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: "environment" } },
      deviceId === null,
    );

    return () => {
      cancelled = true;
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, [open, deviceId, onDetected, supportsCamera]);

  const displayError = !supportsCamera
    ? "El navegador no permite acceder a la cámara acá. Necesita conexión HTTPS (o localhost)."
    : error;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        {displayError ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{displayError}</p>
        ) : (
          <div
            ref={viewportRef}
            className="relative aspect-video overflow-hidden rounded-xl bg-black [&>video]:h-full [&>video]:w-full [&>video]:object-cover [&>canvas]:hidden"
          />
        )}
        {devices.length > 1 && (
          <Select value={deviceId ?? devices[0]?.deviceId} onValueChange={setDeviceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elegir cámara" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device, index) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Cámara ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="text-center text-xs text-muted-foreground">
          Apuntá la cámara al código de barras del producto.
        </p>
      </DialogContent>
    </Dialog>
  );
}
