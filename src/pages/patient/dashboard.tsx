import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CalendarClock,
  HeartPulse,
  Pill,
  GitPullRequest,
  Video,
  Siren,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingBlob } from "@/components/shared/PageHeader";
import { getAppointments } from "@/api/patient/appointments";
import { getReferralStatus } from "@/api/patient/referral-status";
import { getHealthRecord } from "@/api/patient/records";
import type { Appointment } from "@/dto/appointment/Appointment";
import type { Referral } from "@/dto/referral/Referral";
import type { HealthRecordResponse } from "@/dto/health-record/HealthRecordResponse";

const PATIENT_ID = "SWA-9284-1829";

const quickActions: Array<{ to: string; label: string; icon: LucideIcon; color: string }> = [
  { to: "/patient/find-facility", label: "Find Facility", icon: Building2, color: "bg-brand-700" },
  { to: "/patient/appointments", label: "Book Appointment", icon: CalendarClock, color: "bg-purple-600" },
  { to: "/patient/health-records", label: "My Health Records", icon: HeartPulse, color: "bg-pink-600" },
  { to: "/patient/teleconsultation", label: "Teleconsultation", icon: Video, color: "bg-sky-600" },
];

export function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [record, setRecord] = useState<HealthRecordResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, r, h] = await Promise.all([
        getAppointments(PATIENT_ID),
        getReferralStatus(PATIENT_ID),
        getHealthRecord(),
      ]);
      setAppointments(a);
      setReferrals(r);
      setRecord(h);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingBlob />;

  const nextAppointment = appointments.find((a) => a.status === "BOOKED");
  const activeReferrals = referrals.filter((r) =>
    ["SENT", "ACCEPTED", "ARRIVED"].includes(r.status)
  );
  const hr = record!;

  return (
    <div>
      <PageHeader
        title={`Namaste, ${hr.patient.name.split(" ")[0]} 👋`}
        subtitle={`Swasthya ID ${hr.patient.swasthyaId}`}
        actions={<RiskBadge level={hr.patient.riskLevel} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{appointments.filter(a => a.status === "BOOKED").length}</p>
            <p className="text-sm text-muted">Upcoming Appointments</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <GitPullRequest className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{activeReferrals.length}</p>
            <p className="text-sm text-muted">Active Referrals</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
            <Pill className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{hr.medications.filter(m => m.status === "CURRENT").length}</p>
            <p className="text-sm text-muted">Current Medications</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <HeartPulse className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{hr.conditions.filter(c => c.status === "ACTIVE").length}</p>
            <p className="text-sm text-muted">Active Conditions</p>
          </div>
        </Card>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-fg">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="flex items-center gap-3 transition-shadow hover:shadow-md">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </span>
              <span className="flex-1 text-sm font-medium text-fg">{a.label}</span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>{nextAppointment ? "Next Appointment" : "No Upcoming Appointment"}</CardTitle>
          {nextAppointment ? (
            <>
              <CardDescription>
                {nextAppointment.date} · {nextAppointment.time} · {nextAppointment.department}
              </CardDescription>
              <div className="mt-3 text-sm">
                <p><strong>{nextAppointment.doctorName}</strong></p>
                <p className="text-muted">{nextAppointment.reason}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to="/patient/appointments"><Button variant="outline" size="sm">Manage</Button></Link>
                <Link to="/patient/medicine-availability"><Button variant="ghost" size="sm">Reschedule</Button></Link>
              </div>
            </>
          ) : (
            <div className="mt-3 text-sm text-muted">
              No appointments booked yet.
              <Link to="/patient/appointments" className="mt-2 block">
                <Button variant="secondary" size="sm">Book an Appointment</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Medicine Availability</CardTitle>
            <Link to="/patient/medicine-availability" className="text-sm text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { name: "Paracetamol 500mg", status: "In Stock", color: "bg-green-100 text-green-700" },
              { name: "Metformin 500mg", status: "Low Stock", color: "bg-amber-100 text-amber-800" },
              { name: "ORS Sachet", status: "Out of Stock", color: "bg-red-100 text-red-700" },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-lg border border-border p-2.5">
                <span className="text-sm">{m.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.color}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Recent Diagnostics</CardTitle>
          <div className="mt-2 space-y-2">
            {hr.diagnostics.slice().reverse().slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-center justify-between">
                <span className="text-sm">{d.name} <span className="text-muted">· {d.facilityName}</span></span>
                <span className="text-xs text-muted">{d.date}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Referral Activity</CardTitle>
          <div className="mt-2 space-y-2">
            {activeReferrals.length === 0 ? (
              <p className="text-sm text-muted">No active referrals.</p>
            ) : (
              activeReferrals.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <span className="text-sm">{r.specialty} → {r.status}</span>
                  <span className="text-xs text-muted">{r.id}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <Link to="/patient/referral-status">
              <Button variant="outline" size="sm">Track Referrals</Button>
            </Link>
            <Link to="/patient/emergency">
              <Button variant="danger" size="sm"><Siren className="h-4 w-4" /> Emergency</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}