/**
 * Paleta de "tonos" para badges/indicadores de estado (pedidos, roles,
 * medios de pago). Calcada de las constantes CLAY/TEAL/GOLD/SUCCESS del
 * mockup original (ecommerce/src/components/mockups.tsx) para mantener el
 * mismo lenguaje visual.
 */
export type Tone = "ink" | "clay" | "teal" | "gold" | "success" | "neutral";

export const TONE_COLOR: Record<Tone, string> = {
  ink: "oklch(0.24 0.02 60)",
  clay: "oklch(0.58 0.13 45)",
  teal: "oklch(0.6 0.118 184.704)",
  gold: "oklch(0.769 0.188 70.08)",
  success: "oklch(0.6 0.12 155)",
  neutral: "oklch(0.55 0.02 70)",
};

export function withAlpha(oklch: string, alpha: number): string {
  return oklch.replace(/\)$/, ` / ${alpha})`);
}

export function toneStyle(tone: Tone, alpha = 0.14) {
  const color = TONE_COLOR[tone];
  return { backgroundColor: withAlpha(color, alpha), color };
}
