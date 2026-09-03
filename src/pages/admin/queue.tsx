import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPatientQueue } from "@/api/admin/queue";
import type { QueueEntry } from "@/dto/admin/QueueEntry";

const acuityTone: Record<QueueEntry["acuity"], "GREEN" | "YELLOW" | "RED"> = {
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  RED: "RED",
};

export function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientQueue().then((d) => {
      setQueue(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="Patient Queue"
        subtitle="Live view of patients waiting at the facility"
      />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-brand-50 text-left text-muted">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Acuity</th>
              <th className="px-4 py-3 font-medium">Wait</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((q, i) => (
              <tr key={q.id} className="border-b border-border last:border-0 hover:bg-brand-50/40">
                <td className="px-4 py-3 text-muted">{i + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{q.patientName}</p>
                  <p className="text-xs text-muted">{q.swasthyaId}</p>
                </td>
                <td className="px-4 py-3">{q.department}</td>
                <td className="px-4 py-3"><Badge tone={acuityTone[q.acuity]}>{q.acuity}</Badge></td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-muted">
                    <Clock className="h-3 w-3" /> {q.waitMinutes} min
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={q.status === "IN_CONSULTATION" ? "YELLOW" : q.status === "DONE" ? "GREEN" : "INFO"}>
                    {q.status.replace(/_/g, " ")}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}