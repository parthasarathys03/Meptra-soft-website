import type { Lead } from "@/lib/adminApi";

const COLUMNS: (keyof Lead)[] = [
  "submissionId", "createdAt", "name", "phone", "interest", "preferredContact",
  "whatsappNumber", "college", "year", "location", "message",
  "pageUrl", "referrer", "device", "browser", "status", "notes", "updatedAt",
];

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsv(leads: Lead[]): string {
  const header = COLUMNS.join(",");
  const rows = leads.map((lead) => COLUMNS.map((col) => escapeCsvCell(String(lead[col] ?? ""))).join(","));
  return [header, ...rows].join("\n");
}

function download(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLeadsToCsv(leads: Lead[]): void {
  download(`leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(leads), "text/csv");
}

/** Excel opens an HTML table saved with an .xls extension without needing a charting library. */
export function exportLeadsToExcel(leads: Lead[]): void {
  const header = COLUMNS.map((c) => `<th>${c}</th>`).join("");
  const rows = leads
    .map((lead) => `<tr>${COLUMNS.map((col) => `<td>${String(lead[col] ?? "")}</td>`).join("")}</tr>`)
    .join("");
  const html = `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
  download(`leads-${new Date().toISOString().slice(0, 10)}.xls`, html, "application/vnd.ms-excel");
}
