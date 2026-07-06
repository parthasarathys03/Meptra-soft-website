// src/components/admin/LeadDetailDrawer.tsx
import type { Lead } from "@/lib/adminApi";

const FIELD_LABELS: [keyof Lead, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["interest", "Interest"],
  ["preferredContact", "Preferred contact"],
  ["whatsappNumber", "WhatsApp"],
  ["college", "College"],
  ["year", "Year"],
  ["location", "Location"],
  ["message", "Message"],
  ["pageUrl", "Page URL"],
  ["referrer", "Referrer"],
  ["device", "Device"],
  ["browser", "Browser"],
  ["userAgent", "User agent"],
  ["createdAt", "Created"],
  ["updatedAt", "Updated"],
];

export function LeadDetailDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">{lead.name}</h2>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
            Close
          </button>
        </div>
        <dl className="divide-y divide-line-200 text-sm">
          {FIELD_LABELS.map(([key, label]) => (
            <div key={key} className="flex justify-between gap-4 py-2">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-right font-medium text-navy-800 break-all">{String(lead[key] || "—")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
