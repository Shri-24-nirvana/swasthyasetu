import { useState, useMemo } from "react";
import {
  QrCode as QrIcon,
  UserCheck,
  CheckCircle2,
  Clock,
  Users,
  CalendarClock,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { QRScannerModal } from "@/components/shared/QRScannerModal";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";
import { UserRole } from "@/dto/constants/UserRole";
import type { HospitalVisit } from "@/dto/visit/HospitalVisit";
import type { Patient } from "@/dto/patient/Patient";
import { useLanguage } from "@/components/utils/LanguageContext";

export function HospitalDashboard() {
  const user = useAuthStore((s) => s.user);
  const visits = useHospitalDB((s) => s.visits);
  const patients = useHospitalDB((s) => s.patients);
  const facilities = useHospitalDB((s) => s.facilities);
  const checkInVisit = useHospitalDB((s) => s.checkInVisit);
  const createVisit = useHospitalDB((s) => s.createVisit);
  const { t } = useLanguage();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<HospitalVisit | null>(null);
  const [walkinOpen, setWalkinOpen] = useState(false);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form for walk-in / emergency
  const [walkinPatientId, setWalkinPatientId] = useState(patients[0]?.swasthyaId || "");
  const [walkinDept, setWalkinDept] = useState("General Medicine");
  const [walkinDoc, setWalkinDoc] = useState("Dr. Anita Rao");
  const [walkinReason, setWalkinReason] = useState("Walk-in emergency consultation");

  const facility = useMemo(() => {
    return facilities.find((f) => f.id === user?.facilityId) || facilities[0];
  }, [facilities, user]);

  const todayVisits = useMemo(() => {
    return visits.filter((v) => v.facilityId === facility.id || !v.facilityId);
  }, [visits, facility]);

  const filteredVisits = useMemo(() => {
    if (!searchQuery.trim()) return todayVisits;
    const q = searchQuery.toLowerCase().trim();
    return todayVisits.filter(
      (v) =>
        v.patientName.toLowerCase().includes(q) ||
        v.patientId.toLowerCase().includes(q) ||
        v.visitNumber.toLowerCase().includes(q) ||
        (v.tokenNumber && v.tokenNumber.toLowerCase().includes(q))
    );
  }, [todayVisits, searchQuery]);

  const handleQRResolved = ({ visit, patient }: { visit?: HospitalVisit; patient?: Patient }) => {
    if (visit) {
      setSelectedVisit(visit);
    } else if (patient) {
      const newV = createVisit({
        patientId: patient.swasthyaId,
        facilityId: facility.id,
        doctorName: "Dr. Anita Rao",
        department: "General Medicine",
        reason: "OPD Walk-in Arrival",
      });
      setSelectedVisit(newV);
    }
  };

  const handleCheckIn = (visitId: string) => {
    try {
      const { visit, tokenNumber } = checkInVisit(visitId, user?.name || "Rajesh Tiwari");
      setSelectedVisit(visit);
      setIssuedToken(tokenNumber);
    } catch (err: any) {
      alert(err.message || "Failed to check in visit");
    }
  };

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newV = createVisit({
      patientId: walkinPatientId,
      facilityId: facility.id,
      doctorName: walkinDoc,
      department: walkinDept,
      reason: walkinReason,
    });
    const { visit, tokenNumber } = checkInVisit(newV.id, user?.name || "Reception Desk");
    setWalkinOpen(false);
    setSelectedVisit(visit);
    setIssuedToken(tokenNumber);
  };

  const checkedInCount = todayVisits.filter((v) => v.status === "CHECKED_IN" || v.status === "IN_CONSULTATION").length;
  const bookedCount = todayVisits.filter((v) => v.status === "BOOKED").length;
  const completedCount = todayVisits.filter((v) => v.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header Banner - Clean & Highlighted Card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-brand-500/30 bg-surface p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Building2 className="h-3.5 w-3.5" /> {t("hospital_reception")}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-fg">{facility.name}</h1>
          <p className="text-xs text-muted mt-0.5">
            Reception Desk · OPD Token Management · Real-Time Patient Check-In
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setScannerOpen(true)}
            size="lg"
            variant="outline"
            className="font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <QrIcon className="h-5 w-5 text-brand-700 dark:text-brand-400" /> {t("scan_patient_qr")}
          </Button>

          <Button
            onClick={() => setWalkinOpen(true)}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <UserCheck className="h-5 w-5" /> {t("walk_in_check_in")}
          </Button>
        </div>
      </div>

      {/* KPI Stats - Highlighted Glowing Borders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 border border-brand-500/25 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30 group-hover:scale-105 transition">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{todayVisits.length}</p>
            <p className="text-xs text-muted font-medium">{t("hospital_visits")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-amber-500/25 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 group-hover:scale-105 transition">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{bookedCount}</p>
            <p className="text-xs text-muted font-medium">{t("status_booked")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-blue-500/25 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 group-hover:scale-105 transition">
            <Clock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{checkedInCount}</p>
            <p className="text-xs text-muted font-medium">{t("status_checked_in")} / {t("in_queue")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-black text-fg">{completedCount}</p>
            <p className="text-xs text-muted font-medium">{t("status_completed")}</p>
          </div>
        </Card>
      </div>

      {/* Main Queue & Check-in Desk */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-fg">{t("queue")} &amp; {t("walk_in_check_in")}</h2>
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
                  <th className="p-3">{t("token")}</th>
                  <th className="p-3">{t("patient")}</th>
                  <th className="p-3">{t("department")} &amp; {t("doctor")}</th>
                  <th className="p-3">{t("visit_number")}</th>
                  <th className="p-3">{t("stage")}</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVisits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted">
                      {t("no_tests_yet")}
                    </td>
                  </tr>
                ) : (
                  filteredVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-hover transition">
                      <td className="p-3">
                        {v.tokenNumber ? (
                          <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            {v.tokenNumber}
                          </span>
                        ) : (
                          <span className="text-muted font-mono text-xs">{t("not_checked_in")}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-sm text-fg">{v.patientName}</p>
                        <p className="font-mono text-[11px] text-muted">{v.patientId}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-fg">{v.department}</p>
                        <p className="text-muted text-[11px]">{v.doctorName}</p>
                      </td>
                      <td className="p-3 font-mono text-muted">{v.visitNumber}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            v.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : v.status === "CHECKED_IN"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : v.status === "IN_CONSULTATION"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
                          }`}
                        >
                          {t(`status_${v.status.toLowerCase()}`, v.status.replace(/_/g, " "))}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {v.status === "BOOKED" ? (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(v.id)}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 font-bold shadow-sm cursor-pointer"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> {t("check_in_and_token")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedVisit(v)}
                            className="cursor-pointer"
                          >
                            {t("view_pass")}
                          </Button>
                        )}
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
        role={UserRole.HOSPITAL_STAFF}
        onResolved={handleQRResolved}
      />

      {/* High Visibility Walk-in Modal */}
      <Modal open={walkinOpen} onClose={() => setWalkinOpen(false)} title={t("walk_in_check_in")}>
        <form onSubmit={handleWalkinSubmit} className="space-y-4">
          <div className="rounded-2xl border border-border bg-surfaceSecondary p-3 flex items-start gap-2.5 text-xs text-fg">
            <AlertCircle className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" />
            <span>
              {t("walkin_desc")}
            </span>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-fg">{t("select_registered_patient")} *</label>
            <Select value={walkinPatientId} onChange={(e) => setWalkinPatientId(e.target.value)} required>
              {patients.map((p) => (
                <option key={p.swasthyaId} value={p.swasthyaId}>
                  {p.name} ({p.swasthyaId} · {p.village})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-fg">{t("department")}</label>
              <Select value={walkinDept} onChange={(e) => setWalkinDept(e.target.value)}>
                <option>General Medicine</option>
                <option>Pediatrics</option>
                <option>Obstetrics &amp; Gynecology</option>
                <option>Orthopedics</option>
                <option>Emergency Triage</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-fg">{t("duty_doctor")}</label>
              <Select value={walkinDoc} onChange={(e) => setWalkinDoc(e.target.value)}>
                <option>Dr. Anita Rao</option>
                <option>Dr. Rajesh Kumar</option>
                <option>Dr. Priya Singh</option>
                <option>Dr. Suresh Verma</option>
                <option>Dr. Meenakshi Sundaram</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-fg">{t("reason_symptoms")} *</label>
            <Input
              placeholder="e.g. High fever, acute chest discomfort, injury"
              value={walkinReason}
              onChange={(e) => setWalkinReason(e.target.value)}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer mt-2">
            <UserCheck className="h-4 w-4" /> {t("check_in_and_token")}
          </Button>
        </form>
      </Modal>

      {/* Checked-In Token Pass Modal */}
      {selectedVisit && (
        <Modal
          open={!!selectedVisit}
          onClose={() => { setSelectedVisit(null); setIssuedToken(null); }}
          title={t("view_qr_pass")}
          className="max-w-md text-center"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surfaceSecondary p-5 space-y-2">
              <span className="text-xs uppercase font-bold text-muted">{t("your_opd_token")}</span>
              <p className="text-4xl font-black text-brand-700 dark:text-brand-400 tracking-wider font-mono">
                {issuedToken || selectedVisit.tokenNumber || "A-024"}
              </p>
              <p className="text-xs font-semibold text-fg">
                {t("department")}: {selectedVisit.department}
              </p>
              <p className="text-[11px] text-muted">
                {t("doctor")}: {selectedVisit.doctorName}
              </p>
            </div>

            <div className="rounded-xl border border-border p-3 text-left text-xs space-y-1 bg-surface">
              <div className="flex justify-between">
                <span className="text-muted">{t("patient_name")}:</span>
                <span className="font-bold text-fg">{selectedVisit.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("permanent_id_label")}:</span>
                <span className="font-mono font-bold text-brand-700 dark:text-brand-400">{selectedVisit.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("visit_number")}:</span>
                <span className="font-mono text-fg">{selectedVisit.visitNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("stage")}:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{t(`status_${selectedVisit.status.toLowerCase()}`, selectedVisit.status.replace(/_/g, " "))}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => window.print()}>
                {t("print_token_slip")}
              </Button>
              <Button
                className="flex-1 cursor-pointer"
                onClick={() => { setSelectedVisit(null); setIssuedToken(null); }}
              >
                {t("done")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
