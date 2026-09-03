import { useEffect, useState } from "react";
import { Stethoscope, ClipboardList } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { LongitudinalRecord, RecordSummary } from "@/components/shared/LongitudinalRecord";
import { getLongitudinalRecord } from "@/api/healthcare_worker/records";
import { evaluateVitalsRisk } from "@/lib/risk-evaluation";
import { useLanguage } from "@/components/utils/LanguageContext";
import type { HealthRecord } from "@/dto/HealthRecord";

export function WorkerConsultationPage() {
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [recording, setRecording] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { t } = useLanguage();

  const [complaint, setComplaint] = useState("");
  const [bpSys, setBpSys] = useState("155");
  const [bpDia, setBpDia] = useState("96");
  const [hr, setHr] = useState("92");
  const [temp, setTemp] = useState("36.9");
  const [glucose, setGlucose] = useState("180");
  const [spo2, setSpo2] = useState("95");
  const [diagnosis, setDiagnosis] = useState("");
  const [meds, setMeds] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getLongitudinalRecord().then(setRecord);
  }, []);

  if (!record) return <LoadingBlob label="Loading patient record…" />;

  const risk = evaluateVitalsRisk({
    bloodPressureSys: Number(bpSys),
    bloodPressureDia: Number(bpDia),
    heartRate: Number(hr),
    temperature: Number(temp),
    glucose: glucose ? Number(glucose) : undefined,
    spo2: Number(spo2),
  });

  if (completed) {
    return (
      <div>
        <PageHeader title="Consultation Saved" />
        <Card className="border-green-200 bg-green-50 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <ClipboardList className="h-7 w-7" />
          </div>
          <p className="mt-3 text-lg font-bold text-green-700">Consultation recorded & added to patient's longitudinal record</p>
          <p className="mt-1 text-sm text-green-600">Risk level assessed: <strong>{risk.riskLevel}</strong></p>
          <Button className="mt-4" onClick={() => setCompleted(false)}>Start Another</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("begin_consultation")}
        subtitle="Review the patient's longitudinal record before proceeding"
      />

      {!recording ? (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <CardTitle>Step 0 — Review Longitudinal Health Record</CardTitle>
            <RiskBadge level={record.patient.riskLevel} />
          </div>
          <RecordSummary record={record} />
          <p className="mt-3 text-sm text-muted">
            Check vitals trends, active conditions, allergies, and medications before treating.
            The patient&#39;s full history travels with their Swasthya ID.
          </p>
          <div className="mt-4">
            <Button onClick={() => setRecording(true)}>
              <Stethoscope className="h-4 w-4" /> I&#39;ve reviewed the record — Begin Consultation
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <LongitudinalRecord record={record} />
          <Card className="mt-4">
            <CardTitle>New Consultation &amp; Vitals</CardTitle>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Chief Complaint</label>
                <TextArea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="e.g. Fatigue and headache" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">BP Sys</label>
                  <Input type="number" value={bpSys} onChange={(e) => setBpSys(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">BP Dia</label>
                  <Input type="number" value={bpDia} onChange={(e) => setBpDia(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Heart Rate</label>
                  <Input type="number" value={hr} onChange={(e) => setHr(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Temp °C</label>
                  <Input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Glucose</label>
                  <Input type="number" value={glucose} onChange={(e) => setGlucose(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">SpO2 %</label>
                  <Input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
                </div>
              </div>

              <div className="rounded-lg bg-brand-50/60 p-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  Live Risk: <RiskBadge level={risk.riskLevel} /> <span className="text-muted">(score {risk.score})</span>
                </p>
                {risk.flags.length > 0 && (
                  <ul className="mt-1 text-xs text-red-600">
                    {risk.flags.map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Diagnosis</label>
                <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Hypertension" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Medications <span className="text-muted">(name · dose · freq, one per line)</span>
                </label>
                <TextArea value={meds} onChange={(e) => setMeds(e.target.value)} placeholder="Amlodipine 10mg · 1 tablet · once daily" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Clinical Notes</label>
                <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <Button className="w-full" onClick={() => setCompleted(true)}>
                <ClipboardList className="h-4 w-4" /> Save Consultation
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setRecording(false)}>
                Back to Record Review
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}