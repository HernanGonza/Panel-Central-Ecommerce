import { TONE_COLOR, withAlpha, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

const TONES: Tone[] = ["clay", "teal", "gold", "success", "ink"];

function toneForSeed(seed: string): Tone {
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TONES[hash % TONES.length] ?? "clay";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export function ProductThumbnail({
  name,
  imageUrl,
  className,
}: {
  name: string;
  imageUrl?: string | undefined;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn("size-10 shrink-0 rounded-lg object-cover", className)}
      />
    );
  }

  const tone = toneForSeed(name);
  const color = TONE_COLOR[tone];

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
        className,
      )}
      style={{ backgroundColor: withAlpha(color, 0.16), color }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
