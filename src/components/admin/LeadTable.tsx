// src/components/admin/LeadTable.tsx
import { useState } from "react";
import type { Lead } from "@/lib/adminApi";
import { copyAndOpenWhatsApp } from "@/lib/whatsappSummary";

export function LeadTable({
  leads,
  onSelect,
  onWhatsApp,
  onDelete,
}: {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
  onWhatsApp: (copied: boolean) => void;
  onDelete: (submissionId: string) => Promise<boolean>;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  async function handleWhatsAppClick(lead: Lead) {
    const { copied } = await copyAndOpenWhatsApp(lead);
    onWhatsApp(copied);
  }

  async function handleDeleteClick(lead: Lead) {
    if (!window.confirm(`Delete lead "${lead.name}"? This removes it from Firebase and Google Sheets and cannot be undone.`)) return;
    setDeletingId(lead.submissionId);
    await onDelete(lead.submissionId);
    setDeletingId(null);
  }

  if (leads.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">No leads found.</p>;
  }

  return (
    <table className="w-full min-w-[820px] border-collapse text-sm">
      <thead>
        <tr className="border-b border-line-200 text-left text-slate-600">
          <th className="whitespace-nowrap py-2 pr-4">Name</th>
          <th className="whitespace-nowrap py-2 pr-4">Phone</th>
          <th className="whitespace-nowrap py-2 pr-4">Interest</th>
          <th className="whitespace-nowrap py-2 pr-4">Status</th>
          <th className="whitespace-nowrap py-2 pr-4">Created</th>
          <th className="whitespace-nowrap py-2 pr-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.submissionId} className="border-b border-line-200 hover:bg-slate-50">
            <td className="whitespace-nowrap py-2 pr-4 font-medium text-navy-800">{lead.name}</td>
            <td className="whitespace-nowrap py-2 pr-4 text-navy-800">{lead.phone}</td>
            <td className="whitespace-nowrap py-2 pr-4 text-navy-800">{lead.interest}</td>
            <td className="whitespace-nowrap py-2 pr-4">
              <span className="rounded-full bg-aqua-400/20 px-2.5 py-0.5 text-xs font-semibold text-navy-800">
                {lead.status}
              </span>
            </td>
            <td className="whitespace-nowrap py-2 pr-4 text-slate-600">
              {new Date(lead.createdAt).toLocaleString()}
            </td>
            <td className="whitespace-nowrap py-2 pr-4">
              <div className="flex gap-2">
                <button
                  onClick={() => onSelect(lead)}
                  className="rounded border border-navy-800 px-3 py-1 text-xs font-semibold text-navy-800 hover:bg-navy-800 hover:text-white"
                >
                  View
                </button>
                <button
                  onClick={() => handleWhatsAppClick(lead)}
                  className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                >
                  Copy &amp; Send
                </button>
                <button
                  onClick={() => handleDeleteClick(lead)}
                  disabled={deletingId === lead.submissionId}
                  className="rounded border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  {deletingId === lead.submissionId ? "Deleting…" : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
