import { Input } from "@/components/ui/input";

export function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="date"
        value={from}
        max={to || undefined}
        onChange={(e) => onFromChange(e.target.value)}
        className="w-[140px]"
        aria-label="Desde"
      />
      <span className="text-xs text-muted-foreground">a</span>
      <Input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => onToChange(e.target.value)}
        className="w-[140px]"
        aria-label="Hasta"
      />
    </div>
  );
}
