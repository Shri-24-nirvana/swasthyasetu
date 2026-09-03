import { useEffect, useState } from "react";
import { Workflow, ChevronRight } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getReferralMetrics, getAllReferrals } from "@/api/admin/referral-metrics";
import { facilityById } from "@/lib/mock/facilities";
import { ReferralStatus } from "@/dto/constants/ReferralStatus";
import type { Referral } from "@/dto/Referral";

const statusTone: Record<ReferralStatus, "INFO" | "GREEN" | "YELLOW" | "RED"> = {
  CREATED: "INFO",
  SENT: "YELLOW",
  ACCEPTED: "YELLOW",
  ARRIVED: "INFO",
  COMPLETED: "GREEN",
  FOLLOW_UP_SCHEDULED: "GREEN",
};

export function AdminReferralsPage() {
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof getReferralMetrics>> | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [m, r] = await Promise.all([getReferralMetrics(), getAllReferrals()]);
      setMetrics(m);
      setReferrals(r);
      setLoading(false);
    })();
  }, []);

  if (loading || !metrics) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="Referral Completion"
        subtitle="Track referral completion rates and journeys"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Total referrals</p>
          <p className="mt-1 text-2xl font-bold">{metrics.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Completed</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{metrics.completed}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Active</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{metrics.active}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Completion rate</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{metrics.completionRate}%</p>
        </Card>
      </div>

      <div className="mt-4 space-y-3">
        {referrals.map((r) => (
          <Card key={r.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Workflow className="h-4 w-4" />
                </span>
                <p className="font-semibold">{r.id} · {r.specialty}</p>
                <Badge tone={statusTone[r.status]}>{r.status.replace(/_/g, " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                {facilityById(r.fromFacilityId)?.name} <ChevronRight className="inline h-3 w-3" /> {facilityById(r.toFacilityId)?.name}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>{r.priority}</p>
              <p className="text-xs text-muted">{r.createdAt}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}