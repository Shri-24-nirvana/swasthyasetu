import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarPlus,
  QrCode as QrIcon,
  CheckCircle2,
  Printer,
  Download,
  Clock,
  Building2,
  Stethoscope,
  ArrowRight,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { QRCode } from "@/components/shared/QRCode";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";
import { useLanguage } from "@/components/utils/LanguageContext";

const departmentDoctors: Record<string, string[]> = {
  "General Medicine": ["Dr. Anita Rao", "Dr. S. Iyer", "Dr. Rajesh Kumar"],
  "Cardiology": ["Dr. Rajesh Kumar", "Dr. Suresh Verma"],
  "Pediatrics": ["Dr. Priya Singh"],
  "Obstetrics & Gynecology": ["Dr. Meenakshi Sundaram"],
  "Orthopedics": ["Dr. Suresh Verma"],
  "Emergency Triage": ["Dr. Anita Rao", "Duty Medical Officer"],
};

export function AppointmentsPage() {
  const user = useAuthStore((s) => s.user);
  const patients = useHospitalDB((s) => s.patients);
  const visits = useHospitalDB((s) => s.visits);
  const facilities = useHospitalDB((s) => s.facilities);
  const createVisit = useHospitalDB((s) => s.createVisit);
  const { t } = useLanguage();

  const currentPatient = useMemo(() => {
    if (!user) return patients[0];
    return (
      patients.find((p) => p.name.toLowerCase() === user.name.toLowerCase() || p.swasthyaId === user.id) ||
      patients[0]
    );
  }, [user, patients]);

  const patientVisits = useMemo(() => {
    return visits.filter((v) => v.patientId === currentPatient.swasthyaId);
  }, [visits, currentPatient]);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [confirmedVisitId, setConfirmedVisitId] = useState<string | null>(null);

  const activeConfirmedVisit = useMemo(() => {
    if (!confirmedVisitId) return null;
    return visits.find((v) => v.id === confirmedVisitId) || null;
  }, [visits, confirmedVisitId]);

  const [facilityId, setFacilityId] = useState(facilities[0]?.id || "phc-1");
  const [department, setDepartment] = useState("General Medicine");
  const [doctorName, setDoctorName] = useState("Dr. Anita Rao");
  const [appointmentDate, setAppointmentDate] = useState("2026-09-14");
  const [time, setTime] = useState("10:30");
  const [reason, setReason] = useState("Routine health checkup and vitals review");

  const handleFacilityChange = (facId: string) => {
    setFacilityId(facId);
    const fac = facilities.find((f) => f.id === facId);
    if (fac && fac.specialties.length > 0) {
      setDepartment(fac.specialties[0]);
      const docs = departmentDoctors[fac.specialties[0]] || ["Duty Medical Officer"];
      setDoctorName(docs[0]);
    }
  };

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    const docs = departmentDoctors[dept] || ["Duty Medical Officer"];
    setDoctorName(docs[0]);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit = createVisit({
      patientId: currentPatient.swasthyaId,
      facilityId,
      doctorName,
      department,
      reason,
      appointmentDate,
    });

    setBookingOpen(false);
    setConfirmedVisitId(newVisit.id);
  };

  return (
    <div>
      <PageHeader
        title={t("appointments")}
        subtitle="Book consultations and receive live real-time token updates"
        backTo="/patient"
        backLabel={t("dashboard")}
        actions={
          <Button onClick={() => setBookingOpen(true)} className="cursor-pointer">
            <CalendarPlus className="h-4 w-4" /> {t("book_new_appointment")}
          </Button>
        }
      />

      {/* Visits List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patientVisits.map((v) => (
          <Card key={v.id} className="flex flex-col justify-between border-border hover:border-brand-300 transition">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-fg">{v.department}</h3>
                  <p className="text-xs text-muted font-mono">{v.visitNumber}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    v.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : v.status === "CHECKED_IN"
                      ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {t(`status_${v.status.toLowerCase()}`, v.status.replace(/_/g, " "))}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-fg">
                <p className="flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-brand-600" />
                  <span className="font-semibold">{v.doctorName}</span>
                </p>
                <p className="flex items-center gap-1.5 text-muted">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{v.facilityName}</span>
                </p>
                <p className="flex items-center gap-1.5 text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                  {v.tokenNumber && (
                    <span className="ml-auto font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {t("token")}: {v.tokenNumber}
                    </span>
                  )}
                </p>
                {v.reason && <p className="text-xs text-muted mt-2 italic bg-brand-50/40 p-2 rounded-lg">"{v.reason}"</p>}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmedVisitId(v.id)}
                className="w-full flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrIcon className="h-3.5 w-3.5 text-brand-700" /> {t("view_qr_pass")}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Book Appointment Modal */}
      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title={t("book_new_appointment")}>
        <form onSubmit={handleBook} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-fg">{t("select_facility")}</label>
            <Select value={facilityId} onChange={(e) => handleFacilityChange(e.target.value)}>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.type} · {f.district})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-fg">{t("department")}</label>
              <Select value={department} onChange={(e) => handleDepartmentChange(e.target.value)}>
                {Object.keys(departmentDoctors).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-fg">{t("duty_doctor")}</label>
              <Select value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
                {(departmentDoctors[department] || ["Duty Medical Officer"]).map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-fg">{t("preferred_date")}</label>
              <Input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-fg">{t("preferred_time")}</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-fg">{t("reason_symptoms")}</label>
            <Input
              placeholder="e.g. Fever and body ache since 2 days"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2 cursor-pointer">
            {t("confirm")} &amp; {t("my_qr")}
          </Button>
        </form>
      </Modal>

      {/* Appointment Confirmed / Show QR Modal */}
      {activeConfirmedVisit && (
        <Modal
          open={!!activeConfirmedVisit}
          onClose={() => setConfirmedVisitId(null)}
          title={t("view_qr_pass")}
          className="max-w-md text-center"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>{t("active_visit")}</span>
            </div>

            {/* Realtime token status alert badge */}
            {activeConfirmedVisit.tokenNumber ? (
              <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-3 text-center animate-in zoom-in-95">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  ⚡ {t("status_checked_in")}
                </span>
                <p className="text-3xl font-black text-emerald-900 font-mono">
                  {t("token")}: {activeConfirmedVisit.tokenNumber}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                  {activeConfirmedVisit.department} ({activeConfirmedVisit.doctorName})
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800 font-medium">
                <Zap className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                <span>{t("not_checked_in")}</span>
              </div>
            )}

            {/* Scannable Quiet Zone QR */}
            <div className="mx-auto inline-flex flex-col items-center justify-center rounded-2xl border-2 border-brand-600 bg-white p-4 shadow-lg">
              <QRCode value={activeConfirmedVisit.qrToken} size={160} />
              <p className="mt-2 font-mono text-xs font-bold text-brand-900 tracking-wider">
                {activeConfirmedVisit.visitNumber}
              </p>
            </div>

            <div className="rounded-xl bg-brand-50/70 border border-brand-200 p-3 text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">{t("doctor")}:</span>
                <span className="font-bold text-fg">{activeConfirmedVisit.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("facility")}:</span>
                <span className="font-semibold text-fg">{activeConfirmedVisit.facilityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("department")}:</span>
                <span className="font-semibold text-fg">{activeConfirmedVisit.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("swasthya_id")}:</span>
                <span className="font-mono font-bold text-brand-700">{activeConfirmedVisit.patientId}</span>
              </div>
              <div className="flex justify-between border-t border-brand-200 pt-1">
                <span className="text-muted">{t("stage")}:</span>
                <span className="font-bold text-brand-800">{t(`status_${activeConfirmedVisit.status.toLowerCase()}`, activeConfirmedVisit.status.replace(/_/g, " "))}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="cursor-pointer">
                <Printer className="h-3.5 w-3.5" /> {t("print_qr")}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => alert("QR code image downloaded!")} className="cursor-pointer">
                <Download className="h-3.5 w-3.5" /> {t("download_qr")}
              </Button>
            </div>

            <Link to="/patient/my-qr" onClick={() => setConfirmedVisitId(null)}>
              <Button className="w-full mt-1 cursor-pointer">
                {t("my_qr")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
}