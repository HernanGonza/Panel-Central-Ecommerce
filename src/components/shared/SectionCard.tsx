import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4 pb-3 sm:gap-4 sm:px-5 sm:pt-5">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">{children}</div>
    </div>
  );
}
