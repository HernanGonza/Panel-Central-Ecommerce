import { TONE_COLOR, withAlpha, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  tone = "clay",
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: Tone;
  className?: string;
}) {
  const color = TONE_COLOR[tone];
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span
          className="mt-0.5 size-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
      {delta && (
        <span
          className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: withAlpha(color, 0.12), color }}
        >
          {delta}
        </span>
      )}
    </div>
  );
}
