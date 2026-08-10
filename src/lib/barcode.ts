/** Genera un código de 13 dígitos con pinta de EAN — se renderiza como CODE128, así no depende de un checksum válido. */
export function generateBarcode(): string {
  return Math.floor(1_000_000_000_000 + Math.random() * 9_000_000_000_000).toString();
}
