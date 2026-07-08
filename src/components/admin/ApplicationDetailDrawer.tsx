// src/components/admin/ApplicationDetailDrawer.tsx
import { useState } from "react";
import { deleteApplication, updateApplication, type Application, type ApplicationStatus } from "@/lib/adminApi";

const STATUSES: ApplicationStatus[] = ["New", "Reviewing", "Shortlisted", "Rejected", "Hired"];

const FIELD_LABELS: [keyof Application, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["roleTitle", "Role"],
  ["resumeFileName", "Resume file"],
  ["pageUrl", "Page URL"],
  ["referrer", "Referrer"],
  ["device", "Device"],
  ["browser", "Browser"],
  ["userAgent", "User agent"],
  ["createdAt", "Applied"],
  ["updatedAt", "Updated"],
];

const EDITABLE_FIELDS: (keyof Application)[] = ["name", "phone", "email", "roleTitle"];

export function ApplicationDetailDrawer({
  application,
  token,
  onClose,
  onUpdated,
  onDeleted,
}: {
  application: Application;
  token: string;
  onClose: () => void;
  onUpdated: (application: Application) => void;
  onDeleted: (submissionId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Application>(application);
  const [notes, setNotes] = useState(application.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveUpdates(updates: Partial<Application>): Promise<boolean> {
    setSaving(true);
    setError(null);
    const result = await updateApplication(token, application.submissionId, updates);
    setSaving(false);
    if (result.ok) {
      onUpdated({ ...application, ...updates });
    } else {
      setError("Save failed — try again");
    }
    return result.ok;
  }

  async function handleStatusChange(status: ApplicationStatus) {
    await saveUpdates({ status });
  }

  async function handleNotesBlur() {
    if (notes !== application.notes) await saveUpdates({ notes });
  }

  async function handleEditSave() {
    const updates: Partial<Application> = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (draft[key] !== application[key]) (updates as Record<string, unknown>)[key] = draft[key];
    });
    const ok = await saveUpdates(updates);
    if (ok) setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete application from "${application.name}"? This cannot be undone.`)) return;
    setSaving(true);
    const result = await deleteApplication(token, application.submissionId);
    setSaving(false);
    if (result.ok) {
      onDeleted(application.submissionId);
      onClose();
    } else {
      setError("Delete failed — try again");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto overscroll-contain bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">{application.name}</h2>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
            Close
          </button>
        </div>

        {application.resumeUrl && (
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block rounded bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500"
          >
            Open resume
          </a>
        )}

        <label className="mb-1 block text-sm font-semibold text-navy-800">Status</label>
        <select
          value={application.status}
          onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
          disabled={saving}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800"
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
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800 placeholder:text-slate-400"
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
                  className="w-40 rounded border border-line-200 px-2 py-1 text-right text-navy-800"
                />
              ) : (
                <dd className="text-right font-medium text-navy-800 break-all">{String(application[key] || "—")}</dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
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
                  setDraft(application);
                  setEditing(false);
                }}
                className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold text-navy-800"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold text-navy-800"
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
