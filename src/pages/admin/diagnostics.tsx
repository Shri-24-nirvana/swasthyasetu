import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { getDiagnosticsTracking } from "@/api/admin/diagnostics";
import type { DiagnosticReport } from "@/dto/diagnostics/DiagnosticReport";

export function AdminDiagnosticsPage() {
  const [reports, setReports] = useState<DiagnosticReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiagnosticsTracking().then((d) => {
      setReports(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingBlob />;

  const statusClass: Record<DiagnosticReport["status"], string> = {
    PENDING: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-sky-100 text-sky-700",
    REVIEWED: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <PageHeader
        title="Diagnostics Tracking"
        subtitle="Track lab and imaging report status"
      />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-brand-50 text-left text-muted">
              <th className="px-4 py-3 font-medium">Test</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Facility</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-brand-700" />
                    <span className="font-medium">{r.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3 text-muted">{r.facilityName}</td>
                <td className="px-4 py-3 text-muted">{r.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}