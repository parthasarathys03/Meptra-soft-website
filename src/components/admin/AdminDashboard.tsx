// src/components/admin/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { deleteLead, listLeads, type Lead, type LeadStatus } from "@/lib/adminApi";
import { deleteApplication, listApplications, type Application, type ApplicationStatus } from "@/lib/adminApi";
import { StatsBar } from "@/components/admin/StatsBar";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { ApplicationDetailDrawer } from "@/components/admin/ApplicationDetailDrawer";
import { exportLeadsToCsv, exportLeadsToExcel } from "@/lib/exportLeads";
import { exportApplicationsToCsv, exportApplicationsToExcel } from "@/lib/exportApplications";

const PAGE_SIZE = 20;
const STATUS_FILTERS: (LeadStatus | "All")[] = ["All", "New", "Contacted", "Follow-up", "Closed", "Converted"];
const APPLICATION_STATUS_FILTERS: (ApplicationStatus | "All")[] = ["All", "New", "Reviewing", "Shortlisted", "Rejected", "Hired"];

function LeadsPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleTableWhatsApp(copied: boolean) {
    setToast(copied ? "Summary copied — paste it into WhatsApp" : "Couldn't copy automatically — copy it manually");
    setTimeout(() => setToast(null), 4000);
  }

  async function handleDelete(submissionId: string): Promise<boolean> {
    const result = await deleteLead(token, submissionId);
    if (result.ok) {
      setLeads((prev) => prev.filter((l) => l.submissionId !== submissionId));
      setToast("Lead deleted from Firebase & Google Sheets");
      setTimeout(() => setToast(null), 4000);
      return true;
    } else {
      setToast("Delete failed — try again");
      setTimeout(() => setToast(null), 4000);
      return false;
    }
  }

  async function load() {
    setLoading(true);
    const result = await listLeads(token);
    if (result.ok && result.leads) {
      setLeads([...result.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } else {
      onLogout();
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "All" && lead.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.college.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <StatsBar leads={leads} />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, phone, college..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800 placeholder:text-slate-400 sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number]);
            setPage(1);
          }}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm text-navy-800 sm:flex-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={load}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Refresh
        </button>
        <button
          onClick={() => exportLeadsToCsv(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportLeadsToExcel(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export Excel
        </button>
      </div>

      {toast && (
        <div className="mb-4 rounded bg-navy-800 px-3 py-2 text-center text-xs font-medium text-white">{toast}</div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="rounded-lg border border-line-200 bg-white p-4">
          <p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe the table left/right to see all columns →</p>
          <div className="overflow-x-auto">
            <LeadTable leads={pageItems} onSelect={setSelected} onWhatsApp={handleTableWhatsApp} onDelete={handleDelete} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-slate-600">
              Page {page} of {totalPages} ({filtered.length} leads)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <LeadDetailDrawer
          lead={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setLeads((prev) => prev.map((l) => (l.submissionId === updated.submissionId ? updated : l)));
            setSelected(updated);
          }}
          onDeleted={(submissionId) => {
            setLeads((prev) => prev.filter((l) => l.submissionId !== submissionId));
          }}
        />
      )}
    </>
  );
}

function ApplicationsPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof APPLICATION_STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Application | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function handleDelete(submissionId: string): Promise<boolean> {
    const result = await deleteApplication(token, submissionId);
    if (result.ok) {
      setApplications((prev) => prev.filter((a) => a.submissionId !== submissionId));
      setToast("Application deleted from Firebase & Google Sheets");
      setTimeout(() => setToast(null), 4000);
      return true;
    } else {
      setToast("Delete failed — try again");
      setTimeout(() => setToast(null), 4000);
      return false;
    }
  }

  async function load() {
    setLoading(true);
    const result = await listApplications(token);
    if (result.ok && result.applications) {
      setApplications([...result.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } else {
      onLogout();
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    return applications.filter((application) => {
      if (statusFilter !== "All" && application.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        application.name.toLowerCase().includes(q) ||
        application.phone.includes(q) ||
        application.email.toLowerCase().includes(q) ||
        application.roleTitle.toLowerCase().includes(q)
      );
    });
  }, [applications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, phone, email, role..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800 placeholder:text-slate-400 sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as (typeof APPLICATION_STATUS_FILTERS)[number]);
            setPage(1);
          }}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm text-navy-800 sm:flex-none"
        >
          {APPLICATION_STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={load}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Refresh
        </button>
        <button
          onClick={() => exportApplicationsToCsv(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportApplicationsToExcel(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export Excel
        </button>
      </div>

      {toast && (
        <div className="mb-4 rounded bg-navy-800 px-3 py-2 text-center text-xs font-medium text-white">{toast}</div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="rounded-lg border border-line-200 bg-white p-4">
          <p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe the table left/right to see all columns →</p>
          <div className="overflow-x-auto">
            <ApplicationTable applications={pageItems} onSelect={setSelected} onDelete={handleDelete} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-slate-600">
              Page {page} of {totalPages} ({filtered.length} applications)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <ApplicationDetailDrawer
          application={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setApplications((prev) => prev.map((a) => (a.submissionId === updated.submissionId ? updated : a)));
            setSelected(updated);
          }}
          onDeleted={(submissionId) => {
            setApplications((prev) => prev.filter((a) => a.submissionId !== submissionId));
          }}
        />
      )}
    </>
  );
}

export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"leads" | "applications">("leads");

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("leads")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === "leads" ? "bg-navy-800 text-white" : "text-navy-800 hover:bg-navy-800/10"}`}
          >
            Leads
          </button>
          <button
            onClick={() => setTab("applications")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === "applications" ? "bg-navy-800 text-white" : "text-navy-800 hover:bg-navy-800/10"}`}
          >
            Applications
          </button>
        </div>
        <button onClick={onLogout} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
          Log out
        </button>
      </div>

      {tab === "leads" ? (
        <LeadsPanel token={token} onLogout={onLogout} />
      ) : (
        <ApplicationsPanel token={token} onLogout={onLogout} />
      )}
    </div>
  );
}
