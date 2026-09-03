import { useEffect, useState } from "react";
import { ListChecks, Activity } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getTriageQueue, createTriage } from "@/api/healthcare_worker/triage";
import { evaluateVitalsRisk, triageAcuity, type Acuity } from "@/lib/risk-evaluation";
import type { Triage } from "@/dto/triage/Triage";

const acuityTone: Record<Acuity, "RED" | "YELLOW" | "GREEN"> = {
  RED: "RED",
  YELLOW: "YELLOW",
  GREEN: "GREEN",
};

export function TriagePage() {
  const [queue, setQueue] = useState<Triage[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [bpSys, setBpSys] = useState("120");
  const [bpDia, setBpDia] = useState("80");
  const [hr, setHr] = useState("80");
  const [temp, setTemp] = useState("36.8");
  const [glucose, setGlucose] = useState("");
  const [spo2, setSpo2] = useState("97");

  useEffect(() => {
    getTriageQueue().then((d) => {
      setQueue(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingBlob />;

  const assess = () => {
    const { riskLevel, score, flags } = evaluateVitalsRisk({
      bloodPressureSys: Number(bpSys),
      bloodPressureDia: Number(bpDia),
      heartRate: Number(hr),
      temperature: Number(temp),
      glucose: glucose ? Number(glucose) : undefined,
      spo2: Number(spo2),
    });
    const acuity = triageAcuity(score, flags.length);
    return { acuity, flags, score, riskLevel };
  };

  const preview = assess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { acuity, score } = assess();
    await createTriage({
      patientId: "SWA-" + Math.floor(1000 + Math.random() * 9000),
      facilityId: "phc-1",
      assessedBy: "Dr. Anita Rao",
      date: new Date().toISOString().slice(0, 10),
      acuity,
      chiefComplaint: complaint,
      vitalsScore: score,
    });
    setOpen(false);
    getTriageQueue().then(setQueue);
  };

  return (
    <div>
      <PageHeader
        title="Digital Triage"
        subtitle="Assess severity and prioritize care"
        actions={<Button onClick={() => setOpen(true)}><ListChecks className="h-4 w-4" /> New Triage</Button>}
      />

      <Card>
        <h3 className="mb-3 font-semibold">Triage List</h3>
        <div className="space-y-2">
          {queue.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">{t.patientId}</p>
                <p className="text-sm text-muted">{t.chiefComplaint} · {t.assessedBy} · {t.date}</p>
              </div>
              <Badge tone={acuityTone[t.acuity]}>{t.acuity}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="New Triage Assessment">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Patient</label>
            <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Search or enter patient" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Chief Complaint</label>
            <TextArea value={complaint} onChange={(e) => setComplaint(e.target.value)} required />
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
              <Input type="number" value={glucose} onChange={(e) => setGlucose(e.target.value)} placeholder="—" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">SpO2 %</label>
              <Input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-brand-50/50 p-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4" /> Live Acuity:{" "}
              <Badge tone={acuityTone[preview.acuity]}>{preview.acuity}</Badge>
            </p>
            <p className="mt-1 text-xs text-muted">Risk score {preview.score} · {preview.flags.length} alerts</p>
            {preview.flags.length > 0 && (
              <ul className="mt-1 text-xs text-red-600">
                {preview.flags.map((f) => <li key={f}>• {f}</li>)}
              </ul>
            )}
          </div>

          <Button type="submit" className="w-full">Save Triage</Button>
        </form>
      </Modal>
    </div>
  );
}