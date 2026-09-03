import { useEffect, useState } from "react";
import { AlertTriangle, PhoneCall } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getHighRiskPatients } from "@/api/healthcare_worker/high-risk";
import type { Patient } from "@/dto/patient/Patient";
import { RiskLevel } from "@/dto/constants/RiskLevel";

export function HighRiskPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHighRiskPatients().then((d) => {
      setPatients(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="High-Risk Patients"
        subtitle="Patients needing prioritized attention and follow-up"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((p) => (
          <Card key={p.swasthyaId} className="border-red-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{p.swasthyaId}</p>
                </div>
              </div>
              <RiskBadge level={RiskLevel.HIGH} />
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <p>{p.age} yrs · {p.gender} · {p.bloodGroup}</p>
              <p className="text-muted">{p.village}, {p.district}</p>
              {p.allergies.length > 0 && (
                <p className="text-red-600">⚠ Allergies: {p.allergies.join(", ")}</p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="danger" size="sm"><AlertTriangle className="h-3 w-3" /> Flag for Review</Button>
              {p.phone && (
                <Button variant="outline" size="sm"><PhoneCall className="h-3 w-3" /> Call</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}