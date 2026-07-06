// src/components/admin/LeadDetailDrawer.tsx
import { useState } from "react";
import { deleteLead, updateLead, type Lead, type LeadStatus } from "@/lib/adminApi";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Closed", "Converted"];

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

const EDITABLE_FIELDS: (keyof Lead)[] = ["name", "phone", "college", "year", "location", "message"];

export function LeadDetailDrawer({
  lead,
  token,
  onClose,
  onUpdated,
  onDeleted,
}: {
  lead: Lead;
  token: string;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
  onDeleted: (submissionId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Lead>(lead);
  const [notes, setNotes] = useState(lead.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveUpdates(updates: Partial<Lead>) {
    setSaving(true);
    setError(null);
    const result = await updateLead(token, lead.submissionId, updates);
    setSaving(false);
    if (result.ok) {
      onUpdated({ ...lead, ...draft, ...updates });
    } else {
      setError("Save failed — try again");
    }
  }

  async function handleStatusChange(status: LeadStatus) {
    await saveUpdates({ status });
  }

  async function handleNotesBlur() {
    if (notes !== lead.notes) await saveUpdates({ notes });
  }

  async function handleEditSave() {
    const updates: Partial<Lead> = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (draft[key] !== lead[key]) (updates as Record<string, unknown>)[key] = draft[key];
    });
    await saveUpdates(updates);
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
    setSaving(true);
    const result = await deleteLead(token, lead.submissionId);
    setSaving(false);
    if (result.ok) {
      onDeleted(lead.submissionId);
      onClose();
    } else {
      setError("Delete failed — try again");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">{lead.name}</h2>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
            Close
          </button>
        </div>

        <label className="mb-1 block text-sm font-semibold text-navy-800">Status</label>
        <select
          value={lead.status}
          onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
          disabled={saving}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-semibold text-navy-800">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={3}
          disabled={saving}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm"
        />

        {error && <p className="mb-3 text-sm font-medium text-red-500">{error}</p>}

        <dl className="divide-y divide-line-200 text-sm">
          {FIELD_LABELS.map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-2">
              <dt className="text-slate-500">{label}</dt>
              {editing && EDITABLE_FIELDS.includes(key) ? (
                <input
                  value={String(draft[key])}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  className="w-40 rounded border border-line-200 px-2 py-1 text-right"
                />
              ) : (
                <dd className="text-right font-medium text-navy-800 break-all">{String(lead[key] || "—")}</dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-6 flex gap-2">
          {editing ? (
            <>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 rounded bg-navy-800 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(lead);
                  setEditing(false);
                }}
                className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex-1 rounded border border-red-300 py-2 text-sm font-semibold text-red-500 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
