import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { getHighRiskCases } from "@/api/admin/high-risk-cases";
import type { Patient } from "@/dto/Patient";

export function AdminHighRiskPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHighRiskCases().then((d) => {
      setPatients(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="High-Risk Cases"
        subtitle="Patients requiring urgent attention across the district"
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
                  <p className="text-xs text-muted">{p.village}, {p.district}</p>
                </div>
              </div>
              <RiskBadge level={p.riskLevel} />
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <p>{p.age} yrs · {p.bloodGroup}</p>
              {p.allergies.length > 0 && <p className="text-red-600">⚠ {p.allergies.join(", ")}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}