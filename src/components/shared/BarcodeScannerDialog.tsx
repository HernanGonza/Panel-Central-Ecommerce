import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";
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

const hints = new Map<DecodeHintType, unknown>([
  [
    DecodeHintType.POSSIBLE_FORMATS,
    [BarcodeFormat.CODE_128, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8],
  ],
]);

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
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (!open || !videoRef.current || !supportsCamera) return;

    let cancelled = false;
    let controls: IScannerControls | null = null;
    const reader = new BrowserMultiFormatReader(hints);

    function onError(err: unknown) {
      console.error("No se pudo iniciar el escáner de código de barras", err);
      const name = (err as { name?: string })?.name;
      setError(
        name === "NotAllowedError"
          ? "La cámara está bloqueada para este sitio. Habilitala desde el ícono de cámara en la barra de direcciones y volvé a intentar."
          : "No pudimos acceder a la cámara. Revisá los permisos del navegador.",
      );
    }

    async function start(constraints: MediaStreamConstraints, allowFallback: boolean) {
      try {
        const nextControls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current!,
          (result, err) => {
            if (cancelled || !result) {
              if (err && !(err instanceof NotFoundException)) {
                console.warn("Error al decodificar el código de barras", err);
              }
              return;
            }
            cancelled = true;
            nextControls?.stop();
            onDetected(result.getText());
            setOpen(false);
          },
        );
        if (cancelled) {
          nextControls.stop();
          return;
        }
        controls = nextControls;
        BrowserMultiFormatReader.listVideoInputDevices()
          .then((list) => {
            if (!cancelled) setDevices(list);
          })
          .catch(() => undefined);
      } catch (err) {
        if (cancelled) return;
        // Laptops usually have no "environment"-facing camera; fall back to
        // whatever default camera is available (e.g. the built-in webcam).
        if (allowFallback) {
          start({ video: true, audio: false }, false);
          return;
        }
        onError(err);
      }
    }

    start(
      {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: { ideal: "environment" } },
        audio: false,
      },
      deviceId === null,
    );

    return () => {
      cancelled = true;
      controls?.stop();
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
        <div
          className={`relative aspect-video overflow-hidden rounded-xl bg-black ${displayError ? "hidden" : ""}`}
        >
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        </div>
        {displayError && (
          <p className="py-6 text-center text-sm text-muted-foreground">{displayError}</p>
        )}
        {devices.length > 1 && (
          <Select value={deviceId ?? devices[0]!.deviceId} onValueChange={setDeviceId}>
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
