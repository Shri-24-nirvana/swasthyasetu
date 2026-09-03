import { useState } from "react";
import type { HealthRecordResponse } from "@/dto/health-record/HealthRecordResponse";
import { RiskBadge, Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { QRCode } from "@/components/shared/QRCode";
import { VitalsTrendChart } from "@/components/shared/VitalsTrendChart";
import { cn } from "@/lib/utils";

const tabs = [
  "Overview",
  "Conditions",
  "Medications",
  "Visits",
  "Diagnostics",
  "Trends",
] as const;

type Tab = (typeof tabs)[number];

export function LongitudinalRecord({ record }: { record: HealthRecordResponse }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { patient } = record;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="rounded-xl bg-brand-50 p-3 text-brand-700">
            <QRCode value={patient.swasthyaId} size={64} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-fg">{patient.name}</h2>
              <RiskBadge level={patient.riskLevel} />
            </div>
            <p className="text-sm text-muted">
              Swasthya ID {patient.swasthyaId} · {patient.age} yrs ·{" "}
              {patient.bloodGroup} · {patient.village}, {patient.district}
            </p>
            {patient.allergies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patient.allergies.map((a) => (
                  <Badge key={a} tone="RED">
                    ⚠ {a} allergy
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t ? "bg-brand-700 text-white" : "text-muted hover:bg-brand-50"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "Overview" && <OverviewView record={record} />}
          {tab === "Conditions" && <ConditionsView record={record} />}
          {tab === "Medications" && <MedicationsView record={record} />}
          {tab === "Visits" && <VisitsView record={record} />}
          {tab === "Diagnostics" && <DiagnosticsView record={record} />}
          {tab === "Trends" && <TrendsView record={record} />}
        </div>
      </Card>
    </div>
  );
}

function OverviewView({ record }: { record: HealthRecordResponse }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <CardTitle className="text-sm uppercase tracking-wide text-muted">
          Active Conditions
        </CardTitle>
        <ul className="mt-2 space-y-1.5">
          {record.conditions
            .filter((c) => c.status === "ACTIVE")
            .map((c) => (
              <li key={c.condition} className="flex items-center justify-between text-sm">
                <span>{c.condition}</span>
                <Badge tone="YELLOW">Active</Badge>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <CardTitle className="text-sm uppercase tracking-wide text-muted">
          Current Medications
        </CardTitle>
        <ul className="mt-2 space-y-1.5">
          {record.medications
            .filter((m) => m.status === "CURRENT")
            .map((m) => (
              <li key={m.name} className="text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted"> · {m.dosage} · {m.frequency}</span>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <CardTitle className="text-sm uppercase tracking-wide text-muted">
          Recent Visits
        </CardTitle>
        <ul className="mt-2 space-y-1.5">
          {record.consultations.slice(-3).reverse().map((c) => (
            <li key={c.id} className="text-sm">
              <span className="font-medium">{c.date}</span>{" "}
              <span className="text-muted">— {c.diagnosis}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <CardTitle className="text-sm uppercase tracking-wide text-muted">
          Last Diagnostics
        </CardTitle>
        <ul className="mt-2 space-y-1.5">
          {record.diagnostics.slice(-3).reverse().map((d) => (
            <li key={d.id} className="flex items-center justify-between text-sm">
              <span>{d.name}</span>
              <span className="text-muted">{d.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ConditionsView({ record }: { record: HealthRecordResponse }) {
  return (
    <div className="space-y-3">
      {record.conditions.map((c) => (
        <div
          key={c.condition}
          className="flex items-start justify-between rounded-lg border border-border p-3"
        >
          <div>
            <p className="font-medium">{c.condition}</p>
            <p className="text-sm text-muted">Since {c.since}</p>
            {c.notes && <p className="mt-1 text-sm text-muted">{c.notes}</p>}
          </div>
          <Badge tone={c.status === "ACTIVE" ? "YELLOW" : "GREEN"}>{c.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function MedicationsView({ record }: { record: HealthRecordResponse }) {
  return (
    <div className="space-y-4">
      <div>
        <CardTitle className="text-sm uppercase tracking-wide text-muted">
          Current Medications
        </CardTitle>
        <div className="mt-2 space-y-2">
          {record.medications
            .filter((m) => m.status === "CURRENT")
            .map((m) => (
              <div key={m.name} className="rounded-md border border-border p-3">
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-muted">
                  {m.dosage} · {m.frequency}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div>
        <CardTitle className="text-sm uppercase tracking-wide text-muted">
          Past Medications
        </CardTitle>
        <div className="mt-2 space-y-2">
          {record.medications
            .filter((m) => m.status === "PAST")
            .map((m) => (
              <div key={m.name} className="rounded-md border border-border p-3 opacity-70">
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-muted">
                  {m.dosage} · {m.frequency}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function VisitsView({ record }: { record: HealthRecordResponse }) {
  return (
    <div className="relative space-y-4 before:absolute before:left-[5px] before:top-1 before:h-full before:w-px before:bg-border">
      {record.consultations
        .slice()
        .reverse()
        .map((c) => (
          <div key={c.id} className="relative pl-6">
            <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-brand-50" />
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{c.diagnosis}</p>
                <RiskBadge level={c.riskLevel} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {c.date} · {c.doctorName} ·{" "}
                {c.chiefComplaint}
              </p>
              <p className="mt-1 text-sm text-muted">
                BP {c.vitals.bloodPressureSys}/{c.vitals.bloodPressureDia} · HR{" "}
                {c.vitals.heartRate} · Glu {c.vitals.glucose ?? "—"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

function DiagnosticsView({ record }: { record: HealthRecordResponse }) {
  return (
    <div className="space-y-3">
      {record.diagnostics
        .slice()
        .reverse()
        .map((d) => (
          <div key={d.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {d.name} <span className="text-sm font-normal text-muted">({d.type})</span>
              </p>
              <Badge
                tone={
                  d.status === "REVIEWED"
                    ? "GREEN"
                    : d.status === "PENDING"
                    ? "YELLOW"
                    : "INFO"
                }
              >
                {d.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {d.facilityName} · {d.date}
            </p>
            {d.summary && <p className="mt-2 text-sm">{d.summary}</p>}
            {d.keyValues && (
              <div className="mt-2 flex flex-wrap gap-2">
                {d.keyValues.map((kv) => (
                  <span
                    key={kv.label}
                    className={cn(
                      "rounded px-2 py-1 text-xs font-medium",
                      kv.flag === "ABNORMAL"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {kv.label}: {kv.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

function TrendsView({ record }: { record: HealthRecordResponse }) {
  return (
    <div>
      <CardTitle className="mb-2 text-sm uppercase tracking-wide text-muted">
        Vitals Trends
      </CardTitle>
      <VitalsTrendChart record={record} />
    </div>
  );
}

export function RecordSummary({ record }: { record: HealthRecordResponse }) {
  const activeConditions = record.conditions.filter((c) => c.status === "ACTIVE").length;
  const currentMeds = record.medications.filter((m) => m.status === "CURRENT").length;
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <span>💊 {activeConditions} active {activeConditions === 1 ? "condition" : "conditions"}</span>
      <span>💊 {currentMeds} current {currentMeds === 1 ? "medication" : "medications"}</span>
      <span>🩺 {record.consultations.length} visits</span>
      <span>🧪 {record.diagnostics.length} reports</span>
    </div>
  );
}