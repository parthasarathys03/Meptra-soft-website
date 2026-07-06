// src/components/admin/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { listLeads, type Lead, type LeadStatus } from "@/lib/adminApi";
import { StatsBar } from "@/components/admin/StatsBar";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";

const PAGE_SIZE = 20;
const STATUS_FILTERS: (LeadStatus | "All")[] = ["All", "New", "Contacted", "Follow-up", "Closed", "Converted"];

export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    const result = await listLeads(token);
    if (result.ok && result.leads) {
      setLeads([...result.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-800">Leads</h1>
        <button onClick={onLogout} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
          Log out
        </button>
      </div>

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
          className="w-64 rounded border border-line-200 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number]);
            setPage(1);
          }}
          className="rounded border border-line-200 px-3 py-2 text-sm"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={load} className="rounded border border-line-200 px-3 py-2 text-sm font-semibold">
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="rounded-lg border border-line-200 bg-white p-4">
          <LeadTable leads={pageItems} onSelect={setSelected} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Page {page} of {totalPages} ({filtered.length} leads)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line-200 px-3 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line-200 px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && <LeadDetailDrawer lead={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
