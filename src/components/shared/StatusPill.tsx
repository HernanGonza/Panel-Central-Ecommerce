import { toneStyle, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export function StatusPill({
  label,
  tone,
  className,
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
      style={toneStyle(tone)}
    >
      {label}
    </span>
  );
}
