import { useEffect, useState } from "react";
import { CloudOff, Cloud, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getOfflineQueue, syncAll } from "@/api/healthcare_worker/offline-sync";
import type { OfflineItem } from "@/dto/offline-sync/OfflineItem";

const typeIcon: Record<OfflineItem["type"], string> = {
  CONSULTATION: "🩺",
  REFERRAL: "🔄",
  TRIAGE: "📋",
  PATIENT: "🧑",
};

export function OfflineSyncPage() {
  const [items, setItems] = useState<OfflineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setItems(await getOfflineQueue());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingBlob />;

  const pendingCount = items.filter((i) => !i.synced).length;
  const online = true;

  const handleSync = async () => {
    if (!online) return;
    setSyncing(true);
    await syncAll();
    await load();
    setSyncing(false);
  };

  return (
    <div>
      <PageHeader
        title="Offline Sync Status"
        subtitle="Data collected offline is queued and synced automatically"
      />

      <Card className="flex items-center gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${online ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {online ? <Cloud className="h-6 w-6" /> : <CloudOff className="h-6 w-6" />}
        </span>
        <div className="flex-1">
          <p className="font-semibold">{online ? "Connected — Online" : "Offline"}</p>
          <p className="text-sm text-muted">
            {pendingCount} {pendingCount === 1 ? "record" : "records"} pending sync
          </p>
        </div>
        <Button variant={online ? "primary" : "outline"} onClick={handleSync} disabled={!online || syncing || pendingCount === 0}>
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing…" : "Sync Now"}
        </Button>
      </Card>

      {!online && (
        <Card className="mt-4 border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-800">
            You are offline. New records will be stored locally and synced when connectivity returns.
          </p>
        </Card>
      )}

      <div className="mt-4 space-y-3">
        {items.map((i) => (
          <Card key={i.id} className="flex items-center gap-3">
            <span className="text-lg">{typeIcon[i.type]}</span>
            <div className="flex-1">
              <p className="font-medium">{i.type} — {i.patientName}</p>
              <p className="flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3 w-3" /> {i.queuedAt}
              </p>
            </div>
            {i.synced ? (
              <Badge tone="GREEN"><CheckCircle2 className="mr-1 h-3 w-3" /> Synced</Badge>
            ) : (
              <Badge tone="YELLOW">Pending</Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}