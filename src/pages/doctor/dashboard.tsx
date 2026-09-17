import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  QrCode as QrIcon,
  Users,
  CheckCircle2,
  FlaskConical,
  Pill,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { QRScannerModal } from "@/components/shared/QRScannerModal";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";
import { UserRole } from "@/dto/constants/UserRole";
import type { HospitalVisit } from "@/dto/visit/HospitalVisit";
import type { Patient } from "@/dto/patient/Patient";
import { useLanguage } from "@/components/utils/LanguageContext";

export function DoctorDashboard() {
  const user = useAuthStore((s) => s.user);
  const visits = useHospitalDB((s) => s.visits);
  const prescriptions = useHospitalDB((s) => s.prescriptions);
  const testOrders = useHospitalDB((s) => s.testOrders);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const doctorName = user?.name || "Dr. Anita Rao";

  // Filter visits for this doctor or checked-in queue
  const doctorVisits = useMemo(() => {
    return visits.filter(
      (v) => v.doctorName.toLowerCase().includes(doctorName.toLowerCase()) || !v.doctorName
    );
  }, [visits, doctorName]);

  const waitingQueue = useMemo(() => {
    return doctorVisits.filter(
      (v) => v.status === "CHECKED_IN" || v.status === "WAITING_FOR_DOCTOR" || v.status === "IN_CONSULTATION"
    );
  }, [doctorVisits]);

  const completedToday = useMemo(() => {
    return doctorVisits.filter(
      (v) => v.status === "COMPLETED" || v.status === "TESTS_PENDING" || v.status === "PHARMACY_PENDING"
    );
  }, [doctorVisits]);

  const handleQRResolved = ({ visit }: { visit?: HospitalVisit; patient?: Patient }) => {
    if (visit) {
      navigate(`/doctor/consultation?visitId=${visit.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner - Clean & Highlighted Card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-brand-500/30 bg-surface p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
            {t("doctor_consultation")}
          </span>
          <h1 className="mt-2 text-2xl font-black text-fg">{doctorName}</h1>
          <p className="text-xs text-muted mt-0.5">
            Active OPD Queue · Clinical Consultation Suite · E-Prescription &amp; Diagnostic Orders
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setScannerOpen(true)}
            size="lg"
            className="font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <QrIcon className="h-5 w-5" /> {t("scan_patient_qr")}
          </Button>
          {waitingQueue.length > 0 && (
            <Link to={`/doctor/consultation?visitId=${waitingQueue[0].id}`}>
              <Button variant="outline" className="cursor-pointer">
                <Stethoscope className="h-4 w-4 text-brand-700 dark:text-brand-400" /> {t("next_patient")} ({waitingQueue[0].tokenNumber})
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards - Highlighted Glowing Borders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 border border-blue-500/25 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 group-hover:scale-105 transition">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{waitingQueue.length}</p>
            <p className="text-xs text-muted font-medium">{t("waiting_queue")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{completedToday.length}</p>
            <p className="text-xs text-muted font-medium">{t("status_completed")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-purple-500/25 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 group-hover:scale-105 transition">
            <FlaskConical className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{testOrders.length}</p>
            <p className="text-xs text-muted font-medium">{t("diagnostic_tests")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-pink-500/25 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/30 group-hover:scale-105 transition">
            <Pill className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{prescriptions.length}</p>
            <p className="text-xs text-muted font-medium">{t("prescriptions")}</p>
          </div>
        </Card>
      </div>

      {/* OPD Waiting Queue Table */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-fg">{t("waiting_queue")}</h2>
            <p className="text-xs text-muted">{t("tamper_evident")}</p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surfaceSecondary text-muted uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">{t("opd_token")}</th>
                  <th className="p-3">{t("patient")}</th>
                  <th className="p-3">{t("swasthya_id")}</th>
                  <th className="p-3">{t("reason")}</th>
                  <th className="p-3">{t("stage")}</th>
                  <th className="p-3 text-right">{t("view_record")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {waitingQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted">
                      {t("no_tests_yet")}
                    </td>
                  </tr>
                ) : (
                  waitingQueue.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-hover transition">
                      <td className="p-3">
                        <span className="font-mono font-bold text-sm text-brand-700 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                          {v.tokenNumber || "A-024"}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-sm text-fg">{v.patientName}</p>
                        <p className="text-[11px] text-muted">{v.patientAge || 45}y · {v.patientGender || "Female"}</p>
                      </td>
                      <td className="p-3 font-mono font-medium text-brand-700 dark:text-brand-400">{v.patientId}</td>
                      <td className="p-3 text-fg max-w-xs truncate">{v.reason || "General consultation"}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                          {t(`status_${v.status.toLowerCase()}`, v.status.replace(/_/g, " "))}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link to={`/doctor/consultation?visitId=${v.id}`}>
                          <Button size="sm" className="bg-brand-700 hover:bg-brand-600 text-white cursor-pointer">
                            <Stethoscope className="h-3.5 w-3.5" /> {t("start_consultation")}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        role={UserRole.DOCTOR}
        onResolved={handleQRResolved}
      />
    </div>
  );
}
