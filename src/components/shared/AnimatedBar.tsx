import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Barra de progreso que crece desde 0 al montar, en vez de aparecer ya llena. */
export function AnimatedBar({
  pct,
  color,
  opacity = 1,
  className,
  trackClassName,
}: {
  pct: number;
  color: string;
  opacity?: number;
  className?: string;
  trackClassName?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className={cn("mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary", trackClassName)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", className)}
        style={{ width: `${width}%`, backgroundColor: color, opacity }}
      />
    </div>
  );
}
