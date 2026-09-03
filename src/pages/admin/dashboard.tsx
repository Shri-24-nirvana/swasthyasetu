import { useEffect, useState } from "react";
import {
  Users,
  BedDouble,
  GitPullRequest,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { getDashboardStats } from "@/api/admin/analytics";
import type { DashboardStats } from "@/dto/DashboardStats";

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <LoadingBlob />;

  const kpis = [
    { label: "Patients today", value: stats.patientsScannedToday, icon: Users, color: "bg-brand-50 text-brand-700" },
    { label: "Queue size", value: stats.queueSize, icon: Clock, color: "bg-sky-50 text-sky-700" },
    { label: "Bed occupancy", value: `${stats.bedOccupancyPct}%`, icon: BedDouble, color: "bg-green-50 text-green-700" },
    { label: "Active referrals", value: stats.activeReferrals, icon: GitPullRequest, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <PageHeader
        title="Hospital / Government Dashboard"
        subtitle="Overview of facility operations and population health"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="flex items-center gap-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.color}`}>
              <k.icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-bold text-fg">{k.value}</p>
              <p className="text-sm text-muted">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Referrals Overview</CardTitle>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Completion rate</span><strong>{stats.referralCompletionRate}%</strong></div>
            <div className="flex items-center justify-between"><span>Avg journey time</span><strong>{stats.avgJourneyDays} days</strong></div>
          </div>
        </Card>
        <Card>
          <CardTitle>High-Risk Patients</CardTitle>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.highRiskPatients}</p>
              <p className="text-sm text-muted">need attention</p>
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle>Appointments &amp; Teleconsult</CardTitle>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Appointments today</span><strong>{stats.appointmentsToday}</strong></div>
            <div className="flex items-center justify-between"><span>Teleconsults</span><strong>{stats.teleconsultsToday}</strong></div>
          </div>
        </Card>
      </div>
    </div>
  );
}