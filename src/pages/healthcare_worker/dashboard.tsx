import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ListChecks,
  AlertTriangle,
  CalendarClock,
  Stethoscope,
  Workflow,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { searchPatients } from "@/api/healthcare_worker/patients";
import { getHighRiskPatients } from "@/api/healthcare_worker/high-risk";
import { getTriageQueue } from "@/api/healthcare_worker/triage";
import type { Patient } from "@/dto/patient/Patient";
import type { Triage } from "@/dto/triage/Triage";

export function WorkerDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [highRisk, setHighRisk] = useState<Patient[]>([]);
  const [triage, setTriage] = useState<Triage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, h, t] = await Promise.all([
        searchPatients(),
        getHighRiskPatients(),
        getTriageQueue(),
      ]);
      setPatients(p);
      setHighRisk(h);
      setTriage(t);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingBlob />;

  const stats = [
    { label: "Patients Today", value: 42, icon: Search, color: "text-brand-700 dark:text-brand-400 bg-brand-500/15 border border-brand-500/30", borderColor: "border-brand-500/25 hover:border-brand-500/50 hover:shadow-brand-500/10" },
    { label: "In Triage Queue", value: triage.length, icon: ListChecks, color: "text-sky-700 dark:text-sky-400 bg-sky-500/15 border border-sky-500/30", borderColor: "border-sky-500/25 hover:border-sky-500/50 hover:shadow-sky-500/10" },
    { label: "High Risk", value: highRisk.length, icon: AlertTriangle, color: "text-rose-700 dark:text-rose-400 bg-rose-500/15 border border-rose-500/30", borderColor: "border-rose-500/25 hover:border-rose-500/50 hover:shadow-rose-500/10" },
    { label: "Pending Follow-ups", value: 11, icon: CalendarClock, color: "text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30", borderColor: "border-amber-500/25 hover:border-amber-500/50 hover:shadow-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Healthcare Worker Dashboard"
        subtitle="Register, triage, and care for patients"
        actions={
          <Link to="/worker/consultation">
            <Button className="shadow-md font-bold"><Stethoscope className="h-4 w-4" /> Start Consultation</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className={`flex items-center gap-4 border ${s.borderColor} hover:shadow-lg transition group`}>
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.color} group-hover:scale-105 transition`}>
              <s.icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black text-fg">{s.value}</p>
              <p className="text-xs text-muted font-medium">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-border">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <CardTitle>High-Risk Patients</CardTitle>
            <Link to="/worker/high-risk" className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">View all →</Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {highRisk.map((p) => (
              <div key={p.swasthyaId} className="flex items-center justify-between rounded-2xl border border-border dark:border-slate-700/60 bg-surface-secondary/30 p-3.5 hover:border-rose-500/30 transition">
                <div>
                  <p className="font-bold text-sm text-fg">{p.name} <span className="text-xs font-mono text-muted">({p.swasthyaId})</span></p>
                  <p className="text-xs text-muted">{p.age} yrs · {p.village} · {p.bloodGroup}</p>
                </div>
                <RiskBadge level={p.riskLevel} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-border">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <CardTitle>Current Queue</CardTitle>
            <Link to="/worker/triage" className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">Manage triage →</Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {patients.slice(0, 5).map((p, i) => (
              <div key={p.swasthyaId} className="flex items-center justify-between rounded-2xl border border-border dark:border-slate-700/60 bg-surface-secondary/30 p-3.5 hover:border-brand-500/30 transition">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs ${i % 3 === 0 ? "bg-rose-500" : i % 3 === 1 ? "bg-amber-500" : "bg-emerald-500"}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-fg">{p.name}</p>
                    <p className="text-xs text-muted font-mono">{p.swasthyaId}</p>
                  </div>
                </div>
                <Link to="/worker/patients">
                  <Button variant="outline" size="sm"><QrCode className="h-3 w-3" /> Open</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Link to="/worker/patients">
          <Card className="flex items-center gap-3 p-4 transition border border-border hover:border-brand-500/40 hover:bg-surface-hover hover:shadow-md group">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-xs group-hover:scale-105 transition"><Search className="h-5 w-5" /></span>
            <span className="flex-1 text-xs font-bold text-fg">Register / Search Patient</span>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-brand-500 group-hover:translate-x-0.5 transition shrink-0" />
          </Card>
        </Link>
        <Link to="/worker/referrals">
          <Card className="flex items-center gap-3 p-4 transition border border-border hover:border-purple-500/40 hover:bg-surface-hover hover:shadow-md group">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs group-hover:scale-105 transition"><Workflow className="h-5 w-5" /></span>
            <span className="flex-1 text-xs font-bold text-fg">Create / Track Referral</span>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-purple-500 group-hover:translate-x-0.5 transition shrink-0" />
          </Card>
        </Link>
        <Link to="/worker/follow-ups">
          <Card className="flex items-center gap-3 p-4 transition border border-border hover:border-sky-500/40 hover:bg-surface-hover hover:shadow-md group">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs group-hover:scale-105 transition"><CalendarClock className="h-5 w-5" /></span>
            <span className="flex-1 text-xs font-bold text-fg">Follow-Up Schedule</span>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-sky-500 group-hover:translate-x-0.5 transition shrink-0" />
          </Card>
        </Link>
      </div>
    </div>
  );
}