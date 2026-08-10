// U+FEFF, escrito así (no como literal) para que el linter no lo marque como whitespace irregular.
const BOM = String.fromCharCode(0xfeff);

function escapeCsvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function downloadCsv(
  filename: string,
  columns: { label: string; key: string }[],
  rows: Record<string, unknown>[],
) {
  const header = columns.map((c) => escapeCsvCell(c.label)).join(",");
  const body = rows.map((row) => columns.map((c) => escapeCsvCell(row[c.key])).join(","));
  const csv = [header, ...body].join("\r\n");

  // BOM al inicio para que Excel abra el CSV en UTF-8 y no rompa acentos/ñ.
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
