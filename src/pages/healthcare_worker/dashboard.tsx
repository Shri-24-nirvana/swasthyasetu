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
import type { Patient } from "@/dto/Patient";
import type { TriageEntry } from "@/dto/Triage";

export function WorkerDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [highRisk, setHighRisk] = useState<Patient[]>([]);
  const [triage, setTriage] = useState<TriageEntry[]>([]);
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
    { label: "Patients Today", value: 42, icon: Search, color: "text-brand-700 bg-brand-50" },
    { label: "In Triage Queue", value: triage.length, icon: ListChecks, color: "text-sky-700 bg-sky-50" },
    { label: "High Risk", value: highRisk.length, icon: AlertTriangle, color: "text-red-700 bg-red-50" },
    { label: "Pending Follow-ups", value: 11, icon: CalendarClock, color: "text-amber-700 bg-amber-50" },
  ];

  return (
    <div>
      <PageHeader
        title="Healthcare Worker Dashboard"
        subtitle="Register, triage, and care for patients"
        actions={
          <Link to="/worker/consultation">
            <Button><Stethoscope className="h-4 w-4" /> Start Consultation</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-bold text-fg">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>High-Risk Patients</CardTitle>
            <Link to="/worker/high-risk" className="text-sm text-brand-700 hover:underline">View all</Link>
          </div>
          <div className="mt-2 space-y-2">
            {highRisk.map((p) => (
              <div key={p.swasthyaId} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">{p.name} <span className="text-xs text-muted">({p.swasthyaId})</span></p>
                  <p className="text-xs text-muted">{p.age} yrs · {p.village} · {p.bloodGroup}</p>
                </div>
                <RiskBadge level={p.riskLevel} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Current Queue</CardTitle>
            <Link to="/worker/triage" className="text-sm text-brand-700 hover:underline">Manage triage</Link>
          </div>
          <div className="mt-2 space-y-2">
            {patients.slice(0, 5).map((p, i) => (
              <div key={p.swasthyaId} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs text-white ${i % 3 === 0 ? "bg-red-500" : i % 3 === 1 ? "bg-amber-500" : "bg-green-500"}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted">{p.swasthyaId}</p>
                  </div>
                </div>
                <Link to="/worker/patients">
                  <Button variant="ghost" size="sm"><QrCode className="h-3 w-3" /> Open</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Link to="/worker/patients">
          <Card className="flex items-center gap-3 transition-shadow hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white"><Search className="h-5 w-5" /></span>
            <span className="flex-1 text-sm font-medium">Register / Search Patient</span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Card>
        </Link>
        <Link to="/worker/referrals">
          <Card className="flex items-center gap-3 transition-shadow hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white"><Workflow className="h-5 w-5" /></span>
            <span className="flex-1 text-sm font-medium">Create / Track Referral</span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Card>
        </Link>
        <Link to="/worker/follow-ups">
          <Card className="flex items-center gap-3 transition-shadow hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white"><CalendarClock className="h-5 w-5" /></span>
            <span className="flex-1 text-sm font-medium">Manage Follow-ups</span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Card>
        </Link>
      </div>
    </div>
  );
}