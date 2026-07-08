import type { Application } from "@/lib/adminApi";

const COLUMNS: (keyof Application)[] = [
  "submissionId", "createdAt", "name", "phone", "email", "roleTitle",
  "resumeUrl", "resumeFileName", "pageUrl", "referrer", "device", "browser",
  "status", "notes", "updatedAt",
];

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Neutralize CSV/Excel formula injection: a leading =, +, -, or @ makes
 * spreadsheet apps treat the cell as a live formula. Prefixing with a
 * single quote forces text interpretation. */
function sanitizeFormulaCell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toCsv(applications: Application[]): string {
  const header = COLUMNS.join(",");
  const rows = applications.map((app) => COLUMNS.map((col) => escapeCsvCell(sanitizeFormulaCell(String(app[col] ?? "")))).join(","));
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

export function exportApplicationsToCsv(applications: Application[]): void {
  download(`applications-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(applications), "text/csv");
}

/** Excel opens an HTML table saved with an .xls extension without needing a charting library. */
export function exportApplicationsToExcel(applications: Application[]): void {
  const header = COLUMNS.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const rows = applications
    .map((app) => `<tr>${COLUMNS.map((col) => `<td>${escapeHtml(sanitizeFormulaCell(String(app[col] ?? "")))}</td>`).join("")}</tr>`)
    .join("");
  const html = `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
  download(`applications-${new Date().toISOString().slice(0, 10)}.xls`, html, "application/vnd.ms-excel");
}
