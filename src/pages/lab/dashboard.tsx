import { useState, useMemo } from "react";
import {
  FlaskConical,
  QrCode as QrIcon,
  CheckCircle2,
  Clock,
  Upload,
  FileCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { QRScannerModal } from "@/components/shared/QRScannerModal";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";
import { UserRole } from "@/dto/constants/UserRole";
import type { TestOrder, TestOrderStatus, TestResultItem } from "@/dto/diagnostics/TestOrder";
import type { HospitalVisit } from "@/dto/visit/HospitalVisit";
import type { Patient } from "@/dto/patient/Patient";
import { useLanguage } from "@/components/utils/LanguageContext";

export function LabDashboard() {
  const user = useAuthStore((s) => s.user);
  const testOrders = useHospitalDB((s) => s.testOrders);
  const updateTestStatus = useHospitalDB((s) => s.updateTestStatus);
  const { t } = useLanguage();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestOrder | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TestOrderStatus | "ALL">("ALL");

  // Result entry form fields
  const [summaryText, setSummaryText] = useState("Normal parameters observed. No critical abnormalities.");
  const [param1Label, setParam1Label] = useState("Primary Reading");
  const [param1Value, setParam1Value] = useState("13.2");
  const [param1Unit, setParam1Unit] = useState("g/dL");
  const [param1Flag, setParam1Flag] = useState<"NORMAL" | "ABNORMAL" | "CRITICAL">("NORMAL");

  const labTechName = user?.name || "Dinesh Kumar (Lab Tech)";

  const filteredOrders = useMemo(() => {
    let list = testOrders;
    if (statusFilter !== "ALL") {
      list = list.filter((item) => item.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.testName.toLowerCase().includes(q) ||
          item.patientName.toLowerCase().includes(q) ||
          item.patientId.toLowerCase().includes(q) ||
          (item.tokenNumber && item.tokenNumber.toLowerCase().includes(q))
      );
    }
    return list;
  }, [testOrders, statusFilter, searchQuery]);

  const handleQRResolved = ({ visit, patient }: { visit?: HospitalVisit; patient?: Patient }) => {
    const pId = visit?.patientId || patient?.swasthyaId;
    if (pId) {
      setSearchQuery(pId);
    }
  };

  const handleCollectSample = (testId: string) => {
    updateTestStatus(testId, "SAMPLE_COLLECTED", { labTechnician: labTechName });
  };

  const handleStartProcessing = (testId: string) => {
    updateTestStatus(testId, "PROCESSING", { labTechnician: labTechName });
  };

  const handleOpenResultModal = (testItem: TestOrder) => {
    setSelectedTest(testItem);
    if (testItem.testName.includes("CBC") || testItem.testName.includes("Hemoglobin")) {
      setParam1Label("Hemoglobin (Hb)");
      setParam1Value("12.4");
      setParam1Unit("g/dL");
      setSummaryText("Mild microcytic anemia. Platelets adequate.");
    } else if (testItem.testName.includes("Sugar") || testItem.testName.includes("FBS")) {
      setParam1Label("Fasting Glucose");
      setParam1Value("142");
      setParam1Unit("mg/dL");
      setParam1Flag("ABNORMAL");
      setSummaryText("Fasting blood sugar moderately elevated.");
    } else {
      setParam1Label("Test Value");
      setParam1Value("Normal");
      setParam1Unit("");
      setSummaryText("Investigation completed with normal baseline.");
    }
    setResultModalOpen(true);
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;

    const keyValues: TestResultItem[] = [
      {
        label: param1Label,
        value: param1Value,
        unit: param1Unit,
        flag: param1Flag,
      },
    ];

    updateTestStatus(selectedTest.id, "COMPLETED", {
      labTechnician: labTechName,
      summary: summaryText,
      keyValues,
    });

    setResultModalOpen(false);
    setSelectedTest(null);
  };

  const pendingCount = testOrders.filter((item) => item.status === "ORDERED").length;
  const processingCount = testOrders.filter((item) => item.status === "SAMPLE_COLLECTED" || item.status === "PROCESSING").length;
  const completedCount = testOrders.filter((item) => item.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-gradient-to-r from-purple-800 via-indigo-900 to-brand-800 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            {t("lab_diagnostics")}
          </span>
          <h1 className="mt-1 text-2xl font-black">{t("lab_diagnostics")}</h1>
          <p className="text-xs text-purple-100 mt-0.5">
            QR-Based Patient Specimen Tracking · Results Entry · Auto-Publish to Doctor &amp; Patient
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setScannerOpen(true)}
            size="lg"
            className="bg-white text-purple-900 hover:bg-purple-50 shadow-xl font-bold flex items-center gap-2 cursor-pointer"
          >
            <QrIcon className="h-5 w-5 text-purple-700" /> {t("scan_patient_qr")}
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
            <FlaskConical className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{testOrders.length}</p>
            <p className="text-xs text-muted">{t("diagnostic_tests")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Clock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{pendingCount}</p>
            <p className="text-xs text-muted">{t("status_tests_pending")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Upload className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{processingCount}</p>
            <p className="text-xs text-muted">{t("status_processing")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-fg">{completedCount}</p>
            <p className="text-xs text-muted">{t("status_completed")}</p>
          </div>
        </Card>
      </div>

      {/* Lab Queue Table */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-44 text-xs"
            >
              <option value="ALL">{t("all_roles")}</option>
              <option value="ORDERED">{t("status_ordered")}</option>
              <option value="SAMPLE_COLLECTED">{t("status_sample_collected")}</option>
              <option value="PROCESSING">{t("status_processing")}</option>
              <option value="COMPLETED">{t("status_completed")}</option>
            </Select>
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
              <thead className="border-b border-border bg-purple-50/50 text-muted uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">{t("token")}</th>
                  <th className="p-3">{t("diagnostic_tests")}</th>
                  <th className="p-3">{t("patient")}</th>
                  <th className="p-3">{t("doctor")}</th>
                  <th className="p-3">{t("stage")}</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted">
                      {t("no_tests_yet")}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((testItem) => (
                    <tr key={testItem.id} className="hover:bg-purple-50/20 transition">
                      <td className="p-3">
                        <span className="font-mono font-bold text-xs text-purple-800 bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200">
                          {testItem.tokenNumber || testItem.id}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-sm text-fg">{testItem.testName}</p>
                        <p className="text-[11px] text-muted">{testItem.department} · {testItem.category}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-fg">{testItem.patientName}</p>
                        <p className="font-mono text-[11px] text-muted">{testItem.patientId}</p>
                      </td>
                      <td className="p-3 text-fg">{testItem.doctorName}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            testItem.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : testItem.status === "PROCESSING"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : testItem.status === "SAMPLE_COLLECTED"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {t(`status_${testItem.status.toLowerCase()}`, testItem.status.replace(/_/g, " "))}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {testItem.status === "ORDERED" && (
                          <Button size="sm" onClick={() => handleCollectSample(testItem.id)} className="cursor-pointer">
                            {t("collect_sample")}
                          </Button>
                        )}
                        {testItem.status === "SAMPLE_COLLECTED" && (
                          <Button size="sm" variant="secondary" onClick={() => handleStartProcessing(testItem.id)} className="cursor-pointer">
                            {t("start_processing")}
                          </Button>
                        )}
                        {testItem.status === "PROCESSING" && (
                          <Button size="sm" className="bg-purple-700 text-white hover:bg-purple-600 cursor-pointer" onClick={() => handleOpenResultModal(testItem)}>
                            {t("enter_result_publish")}
                          </Button>
                        )}
                        {testItem.status === "COMPLETED" && (
                          <span className="text-emerald-700 font-bold text-xs flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {t("status_completed")}
                          </span>
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
        role={UserRole.LAB}
        onResolved={handleQRResolved}
      />

      {/* Enter Test Result Modal */}
      {selectedTest && (
        <Modal
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          title={`${t("enter_result_publish")} — ${selectedTest.testName}`}
          className="max-w-lg"
        >
          <form onSubmit={handleSubmitResult} className="space-y-4">
            <div className="rounded-xl border border-border p-3 text-xs space-y-1 bg-surface">
              <p>{t("patient")}: <strong>{selectedTest.patientName}</strong> ({selectedTest.patientId})</p>
              <p>{t("doctor")}: <strong>{selectedTest.doctorName}</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-fg">{t("parameter_name")}</label>
                <Input value={param1Label} onChange={(e) => setParam1Label(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-fg">{t("observed_value")}</label>
                <Input value={param1Value} onChange={(e) => setParam1Value(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-fg">{t("unit")}</label>
                <Input value={param1Unit} onChange={(e) => setParam1Unit(e.target.value)} placeholder="e.g. mg/dL" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-fg">{t("clinical_flag")}</label>
                <Select value={param1Flag} onChange={(e) => setParam1Flag(e.target.value as any)}>
                  <option value="NORMAL">NORMAL</option>
                  <option value="ABNORMAL">ABNORMAL</option>
                  <option value="CRITICAL">CRITICAL</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-fg">{t("diagnostic_summary")}</label>
              <TextArea
                rows={2}
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-600 cursor-pointer">
              <FileCheck className="h-4 w-4" /> {t("save")}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
