/**
 * Series agregadas para gráficos históricos (tendencia de ventas, ranking de
 * productos más vendidos, etc.). No se derivan de las entidades base porque
 * representarían meses de histórico transaccional que no tiene sentido
 * modelar a mano en un fixture — cuando conectemos Supabase, esto pasa a ser
 * una vista/consulta agregada real. El desglose de stock por categoría, en
 * cambio, sí se deriva en vivo de `Product` (ver features/stock).
 */

export const salesTrend = [
  { month: "Ene", currentYear: 24, previousYear: 20 },
  { month: "Feb", currentYear: 27, previousYear: 22 },
  { month: "Mar", currentYear: 25, previousYear: 23 },
  { month: "Abr", currentYear: 30, previousYear: 22 },
  { month: "May", currentYear: 29, previousYear: 24 },
  { month: "Jun", currentYear: 33, previousYear: 25 },
  { month: "Jul", currentYear: 32, previousYear: 26 },
  { month: "Ago", currentYear: 36, previousYear: 28 },
  { month: "Sep", currentYear: 35, previousYear: 29 },
  { month: "Oct", currentYear: 39, previousYear: 31 },
  { month: "Nov", currentYear: 38, previousYear: 32 },
  { month: "Dic", currentYear: 42, previousYear: 34 },
];

export const salesByCategory = [
  { category: "Remeras", pct: 38 },
  { category: "Abrigo", pct: 24 },
  { category: "Pantalones", pct: 22 },
  { category: "Calzado", pct: 16 },
];

export const topSellingProducts = [
  { product: "Campera de jean oversize", units: 312 },
  { product: "Buzo canguro friza", units: 268 },
  { product: "Zapatillas urbanas", units: 204 },
  { product: "Jean recto tiro alto", units: 189 },
];
