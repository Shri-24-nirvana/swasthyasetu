import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  Pill,
  Video,
  Siren,
  ArrowRight,
  QrCode as QrIcon,
  CreditCard,
  Receipt,
  FlaskConical,
  Stethoscope,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";
import { useLanguage } from "@/components/utils/LanguageContext";

const visitLifecycleStepKeys = [
  { key: "BOOKED", labelKey: "step_booked" },
  { key: "CHECKED_IN", labelKey: "step_checked_in" },
  { key: "IN_CONSULTATION", labelKey: "step_in_consultation" },
  { key: "TESTS_PENDING", labelKey: "step_tests_pending" },
  { key: "PHARMACY_PENDING", labelKey: "step_pharmacy_pending" },
  { key: "COMPLETED", labelKey: "step_completed" },
];

export function PatientDashboard() {
  const user = useAuthStore((s) => s.user);
  const patients = useHospitalDB((s) => s.patients);
  const visits = useHospitalDB((s) => s.visits);
  const testOrders = useHospitalDB((s) => s.testOrders);
  const prescriptions = useHospitalDB((s) => s.prescriptions);
  const bills = useHospitalDB((s) => s.bills);
  const { t } = useLanguage();

  const currentPatient = useMemo(() => {
    if (!user) return patients[0];
    return (
      patients.find((p) => p.name.toLowerCase() === user.name.toLowerCase() || p.swasthyaId === user.id) ||
      patients[0]
    );
  }, [user, patients]);

  const activeVisit = useMemo(() => {
    return visits.find((v) => v.patientId === currentPatient.swasthyaId && v.status !== "COMPLETED");
  }, [visits, currentPatient]);

  const patientVisits = useMemo(() => {
    return visits.filter((v) => v.patientId === currentPatient.swasthyaId);
  }, [visits, currentPatient]);

  const patientTests = useMemo(() => {
    return testOrders.filter((t) => t.patientId === currentPatient.swasthyaId);
  }, [testOrders, currentPatient]);

  const patientPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => p.patientId === currentPatient.swasthyaId);
  }, [prescriptions, currentPatient]);

  const patientBills = useMemo(() => {
    return bills.filter((b) => b.patientId === currentPatient.swasthyaId);
  }, [bills, currentPatient]);

  // Live Queue Calculation
  const queueInfo = useMemo(() => {
    if (!activeVisit || !activeVisit.tokenNumber) return null;
    const tokenNum = parseInt(activeVisit.tokenNumber.replace(/\D/g, ""), 10) || 24;
    const currentServingNum = Math.max(1, tokenNum - 3);
    const prefix = activeVisit.tokenNumber.split("-")[0] || "A";
    const currentlyServing = `${prefix}-${String(currentServingNum).padStart(3, "0")}`;
    const ahead = Math.max(0, tokenNum - currentServingNum);
    return {
      token: activeVisit.tokenNumber,
      currentlyServing,
      ahead,
      estMinutes: ahead * 6,
    };
  }, [activeVisit]);

  // Current visit lifecycle index
  const activeStepIndex = useMemo(() => {
    if (!activeVisit) return -1;
    if (activeVisit.status === "BOOKED") return 0;
    if (activeVisit.status === "CHECKED_IN") return 1;
    if (activeVisit.status === "IN_CONSULTATION") return 2;
    if (activeVisit.status === "TESTS_PENDING") return 3;
    if (activeVisit.status === "PHARMACY_PENDING" || activeVisit.status === "MEDICINES_DISPENSED") return 4;
    if (activeVisit.status === "COMPLETED") return 5;
    return 1;
  }, [activeVisit]);

  const quickActions = [
    { to: "/patient/my-qr", labelKey: "my_qr", icon: QrIcon, color: "bg-brand-700", descKey: "show_at_hospital" },
    { to: "/patient/health-card", labelKey: "health_card", icon: CreditCard, color: "bg-teal-700", descKey: "permanent_id_card" },
    { to: "/patient/appointments", labelKey: "appointments", icon: CalendarClock, color: "bg-purple-600", descKey: "schedule_consultation" },
    { to: "/patient/bills", labelKey: "bills", icon: Receipt, color: "bg-emerald-600", descKey: "dispensed_bills" },
    { to: "/patient/diagnostics", labelKey: "diagnostics", icon: FlaskConical, color: "bg-blue-600", descKey: "test_results" },
    { to: "/patient/teleconsultation", labelKey: "teleconsultation", icon: Video, color: "bg-sky-600", descKey: "video_doctor_call" },
    { to: "/patient/emergency", labelKey: "emergency", icon: Siren, color: "bg-red-600", descKey: "urgent_care" },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Header Banner with ID - Highlighted & Fresh */}
      <div className="flex flex-col gap-4 rounded-3xl border border-brand-500/30 bg-surface p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-lg shadow-brand-500/25 text-xl font-black">
            {currentPatient.name.charAt(0)}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-fg">{t("namaste")}, {currentPatient.name} 🙏</h1>
              <RiskBadge level={currentPatient.riskLevel} />
            </div>
            <p className="mt-1 text-xs text-muted flex flex-wrap items-center gap-1.5">
              <span>{t("permanent_id_label")}:</span>
              <span className="font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-500/15 px-2.5 py-0.5 rounded-lg border border-brand-500/30">
                {currentPatient.swasthyaId}
              </span>
              <span>· {currentPatient.village}, {currentPatient.district}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/patient/health-card">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <CreditCard className="h-4 w-4 text-brand-700 dark:text-brand-400" /> {t("health_card")}
            </Button>
          </Link>
          <Link to="/patient/my-qr">
            <Button size="sm" className="cursor-pointer">
              <QrIcon className="h-4 w-4" /> {t("my_qr")}
            </Button>
          </Link>
        </div>
      </div>

      {/* ACTIVE VISIT & LIVE QUEUE TRACKER */}
      {activeVisit && (
        <Card className="border border-brand-500/30 bg-surface shadow-md p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-fg">{t("current_hospital_visit")}</h3>
                  <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 rounded-md">
                    {activeVisit.visitNumber}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {activeVisit.facilityName} · <strong>{activeVisit.doctorName}</strong> ({activeVisit.department})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("stage")}: {t(`status_${activeVisit.status.toLowerCase()}`, activeVisit.status.replace(/_/g, " "))}
              </span>
              <Link to="/patient/my-qr">
                <Button size="sm" variant="secondary" className="cursor-pointer">
                  <QrIcon className="h-3.5 w-3.5" /> {t("show_qr")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Live OPD Queue Status Box - 4 Highlighted Colored Stat Tiles */}
          {queueInfo && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 dark:bg-brand-500/15 p-4 text-center transition hover:border-brand-500/50 shadow-xs">
                <span className="text-[11px] text-brand-700 dark:text-brand-300 font-bold uppercase tracking-wider">{t("your_opd_token")}</span>
                <p className="text-3xl font-black text-brand-700 dark:text-brand-300 mt-1">{queueInfo.token}</p>
                <p className="text-[10px] text-muted mt-0.5">{activeVisit.department}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 p-4 text-center transition hover:border-emerald-500/50 shadow-xs">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">{t("currently_serving")}</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{queueInfo.currentlyServing}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{t("in_doctor_room")}</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-4 text-center transition hover:border-amber-500/50 shadow-xs">
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">{t("patients_ahead")}</span>
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{queueInfo.ahead}</p>
                <p className="text-[10px] text-muted mt-0.5">{t("in_queue")}</p>
              </div>
              <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/15 p-4 text-center transition hover:border-sky-500/50 shadow-xs">
                <span className="text-[11px] text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider">{t("estimated_wait")}</span>
                <p className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">~{queueInfo.estMinutes}m</p>
                <p className="text-[10px] text-muted mt-0.5">{t("realtime_sync")}</p>
              </div>
            </div>
          )}

          {/* Patient Hospital Journey Progress Bar */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-fg">{t("hospital_journey_workflow")}</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 text-center text-xs">
              {visitLifecycleStepKeys.map((step, idx) => {
                const isDone = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                return (
                  <div
                    key={step.key}
                    className={`rounded-xl border p-2.5 transition ${
                      isCurrent
                        ? "border-brand-500 bg-gradient-to-r from-brand-600 to-emerald-600 text-white font-bold shadow-md shadow-brand-500/25"
                        : isDone
                        ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "border-border bg-surface-secondary/40 text-muted"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider mb-1">
                      {t("step")} {idx + 1} {isDone ? "✓" : isCurrent ? "●" : ""}
                    </div>
                    <div className="text-xs leading-tight">{t(step.labelKey)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* KPI Cards - Highlighted Glowing Borders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 border border-brand-500/25 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30 group-hover:scale-105 transition">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{patientVisits.length}</p>
            <p className="text-xs text-muted font-medium">{t("hospital_visits")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-blue-500/25 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 group-hover:scale-105 transition">
            <FlaskConical className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{patientTests.length}</p>
            <p className="text-xs text-muted font-medium">{t("diagnostic_tests")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-pink-500/25 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/30 group-hover:scale-105 transition">
            <Pill className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{patientPrescriptions.length}</p>
            <p className="text-xs text-muted font-medium">{t("prescriptions")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
            <Receipt className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{patientBills.length}</p>
            <p className="text-xs text-muted font-medium">{t("medicine_bills")}</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="mb-3 text-base font-bold text-fg">{t("quick_actions")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to}>
              <Card className="flex items-center gap-3 p-3.5 transition border border-border hover:border-brand-500/40 hover:bg-surface-hover hover:shadow-md group">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${a.color} group-hover:scale-105 transition`}>
                  <a.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-fg truncate">{t(a.labelKey)}</p>
                  <p className="text-[11px] text-muted truncate">{t(a.descKey, "")}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted group-hover:text-brand-500 group-hover:translate-x-0.5 transition shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Recent Prescriptions & Tests */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Prescriptions */}
        <Card className="border border-border">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <CardTitle>{t("recent_prescriptions")}</CardTitle>
            <Link to="/patient/medicine-availability" className="text-xs text-brand-700 dark:text-brand-400 font-semibold hover:underline">
              {t("medicine_counter")} →
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {patientPrescriptions.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">{t("no_prescriptions_yet")}</p>
            ) : (
              patientPrescriptions.map((rx) => (
                <div key={rx.id} className="rounded-2xl border border-border dark:border-slate-700/60 bg-surface-secondary/30 p-3.5 space-y-2 hover:border-brand-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-fg">{rx.doctorName}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rx.status === "DISPENSED"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {t(`status_${rx.status.toLowerCase()}`, rx.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{t("diagnosis")}: <span className="text-fg font-medium">{rx.diagnosis}</span></p>
                  <div className="space-y-1 pt-1">
                    {rx.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs bg-surface/80 px-2.5 py-1.5 rounded-lg border border-border">
                        <span className="font-medium text-fg">• {item.medicineName}</span>
                        <span className="text-muted font-mono">{item.dosage} ({item.quantity} {t("units")})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Diagnostic Lab Tests */}
        <Card className="border border-border">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <CardTitle>{t("diagnostic_lab_orders")}</CardTitle>
            <Link to="/patient/diagnostics" className="text-xs text-brand-700 dark:text-brand-400 font-semibold hover:underline">
              {t("view_all_reports")} →
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {patientTests.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">{t("no_tests_yet")}</p>
            ) : (
              patientTests.map((testItem) => (
                <div key={testItem.id} className="rounded-2xl border border-border dark:border-slate-700/60 bg-surface-secondary/30 p-3.5 space-y-1.5 hover:border-brand-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-fg">{testItem.testName}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        testItem.status === "COMPLETED"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : testItem.status === "PROCESSING"
                          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {t(`status_${testItem.status.toLowerCase()}`, testItem.status.replace(/_/g, " "))}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{testItem.doctorName} · {testItem.facilityName}</p>
                  {testItem.summary && (
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300 bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30 mt-1">
                      {t("result")}: {testItem.summary}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}