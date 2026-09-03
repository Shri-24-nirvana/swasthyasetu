import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getFollowUps, completeFollowUp } from "@/api/healthcare_worker/follow-up";
import type { FollowUp } from "@/dto/follow-up/FollowUp";

const tone: Record<FollowUp["status"], "INFO" | "GREEN" | "YELLOW" | "RED"> = {
  SCHEDULED: "INFO",
  DUE: "YELLOW",
  OVERDUE: "RED",
  COMPLETED: "GREEN",
};

export function FollowUpsPage() {
  const [items, setItems] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setItems(await getFollowUps());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingBlob />;

  const handleComplete = async (id: string) => {
    await completeFollowUp(id);
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Follow-up Management"
        subtitle="Track scheduled follow-ups and reminders"
      />
      <div className="space-y-3">
        {items.map((f) => (
          <Card key={f.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{f.patientName}</p>
                <Badge tone={tone[f.status]}>{f.status}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted">
                {f.reason} · {f.specialty} · Due {f.dueDate}
              </p>
              <p className="mt-0.5 text-xs text-muted">{f.patientId}</p>
            </div>
            <div className="flex gap-2">
              {f.status !== "COMPLETED" && (
                <Button variant="success" size="sm" onClick={() => handleComplete(f.id)}>
                  <CheckCircle2 className="h-3 w-3" /> Mark Complete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-4 flex items-center gap-3 border-dashed">
        <CalendarClock className="h-5 w-5 text-muted" />
        <p className="text-sm text-muted">In a live deployment, patients get SMS/IVR follow-up reminders automatically.</p>
      </Card>
    </div>
  );
}