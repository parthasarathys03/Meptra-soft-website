// src/components/admin/StatsBar.tsx
import type { Lead, LeadStatus } from "@/lib/adminApi";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Closed", "Converted"];

export function StatsBar({ leads }: { leads: Lead[] }) {
  const counts = STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));
  const today = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      <div className="rounded-lg border border-line-200 bg-white p-4">
        <p className="text-2xl font-bold text-navy-800">{leads.length}</p>
        <p className="text-xs text-slate-500">Total leads</p>
      </div>
      <div className="rounded-lg border border-line-200 bg-white p-4">
        <p className="text-2xl font-bold text-navy-800">{todayCount}</p>
        <p className="text-xs text-slate-500">Today</p>
      </div>
      {counts.map(({ status, count }) => (
        <div key={status} className="rounded-lg border border-line-200 bg-white p-4">
          <p className="text-2xl font-bold text-navy-800">{count}</p>
          <p className="text-xs text-slate-500">{status}</p>
        </div>
      ))}
    </div>
  );
}
