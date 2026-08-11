import { Link } from "react-router-dom";
import { TONE_COLOR, withAlpha, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  tone = "clay",
  to,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: Tone;
  to?: string;
  className?: string;
}) {
  const color = TONE_COLOR[tone];
  const content = (
    <>
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
    </>
  );

  const baseClassName = cn(
    "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]",
    to && "block transition-colors hover:bg-secondary/40 hover:border-accent/40",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}
