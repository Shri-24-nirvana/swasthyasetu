import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Receipt,
  Globe,
  BedDouble,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useHospitalDB } from "@/lib/database/db";

export function SuperAdminDashboard() {
  const facilities = useHospitalDB((s) => s.facilities);
  const patients = useHospitalDB((s) => s.patients);
  const bills = useHospitalDB((s) => s.bills);
  const auditLogs = useHospitalDB((s) => s.auditLogs);

  const totalBeds = facilities.reduce((acc, f) => acc + (f.bedCapacity ?? 0), 0);
  const occupiedBeds = facilities.reduce((acc, f) => acc + (f.occupiedBeds ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-orange-500/30 bg-surface p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded-full bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
            National Health Mission &amp; ABDM Core
          </span>
          <h1 className="mt-2 text-2xl font-black text-fg">SwasthyaSetu Central Command &amp; Governance</h1>
          <p className="text-xs text-muted mt-0.5">
            Inter-Facility Health Exchange · State-Level Population Analytics · Security &amp; Compliance Audit
          </p>
        </div>

        <Link to="/admin/audit-logs">
          <Button className="font-bold cursor-pointer shadow-md">
            <ShieldCheck className="h-4 w-4" /> National Audit Ledger ({auditLogs.length})
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 border border-orange-500/25 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30 group-hover:scale-105 transition">
            <Globe className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{facilities.length}</p>
            <p className="text-xs text-muted font-medium">Connected Health Facilities</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-brand-500/25 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30 group-hover:scale-105 transition">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{patients.length}</p>
            <p className="text-xs text-muted font-medium">Issued Swasthya IDs</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-blue-500/25 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 group-hover:scale-105 transition">
            <BedDouble className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{occupiedBeds} / {totalBeds}</p>
            <p className="text-xs text-muted font-medium">Bed Occupancy ({Math.round((occupiedBeds / totalBeds) * 100)}%)</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
            <Receipt className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{bills.length}</p>
            <p className="text-xs text-muted font-medium">Cashless Bills Settled</p>
          </div>
        </Card>
      </div>

      {/* Facilities Network */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <CardTitle>State Health Infrastructure Network</CardTitle>
          <span className="text-xs text-muted">Real-time status across PHCs, CHCs, and District Hospitals</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border p-4 space-y-2 bg-brand-50/20">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-fg">{f.name}</h4>
                  <p className="text-xs text-muted font-mono">{f.district} · {f.state}</p>
                </div>
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                  {f.type}
                </span>
              </div>
              <p className="text-xs text-fg">Specialties: {f.specialties.join(", ")}</p>
              <div className="flex justify-between text-xs pt-2 border-t border-border text-muted">
                <span>Beds: <strong>{f.occupiedBeds} / {f.bedCapacity}</strong></span>
                <span className="text-emerald-700 font-semibold">● Online &amp; Synced</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
