// src/components/admin/LeadTable.tsx
import type { Lead } from "@/lib/adminApi";

export function LeadTable({ leads, onSelect }: { leads: Lead[]; onSelect: (lead: Lead) => void }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-line-200 text-left text-slate-500">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Phone</th>
          <th className="py-2 pr-4">Interest</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Created</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.submissionId}
            className="cursor-pointer border-b border-line-200 hover:bg-slate-50"
            onClick={() => onSelect(lead)}
          >
            <td className="py-2 pr-4 font-medium text-navy-800">{lead.name}</td>
            <td className="py-2 pr-4">{lead.phone}</td>
            <td className="py-2 pr-4">{lead.interest}</td>
            <td className="py-2 pr-4">
              <span className="rounded-full bg-aqua-400/15 px-2.5 py-0.5 text-xs font-semibold text-aqua-700">
                {lead.status}
              </span>
            </td>
            <td className="py-2 pr-4 text-slate-500">{new Date(lead.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
