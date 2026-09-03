import { useEffect, useState } from "react";
import { Workflow, ArrowRight, ChevronRight } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getReferrals, createReferral, advanceReferralStatus } from "@/api/healthcare_worker/referrals";
import { facilityById } from "@/lib/mock/facilities";
import type { Referral } from "@/dto/referral/Referral";
import { ReferralStatus } from "@/dto/constants/ReferralStatus";

export function WorkerReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [toFacilityId, setToFacilityId] = useState("dh-1");
  const [specialty, setSpecialty] = useState("Cardiology");
  const [priority, setPriority] = useState<"EMERGENCY" | "URGENT" | "ROUTINE">("ROUTINE");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const load = async () => {
    setReferrals(await getReferrals());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingBlob />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReferral({
      patientId: "SWA-9284-1829",
      fromFacilityId: "phc-1",
      toFacilityId,
      specialty,
      priority,
      reason,
      clinicalNotes: notes,
    });
    setOpen(false);
    setReason("");
    setIsLoading(true);
    await load();
  };

  const handleAdvance = async (id: string) => {
    await advanceReferralStatus(id);
    await load();
  };

  if (isLoading) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle="Create and track patient referrals between facilities"
        actions={<Button onClick={() => setOpen(true)}><Workflow className="h-4 w-4" /> New Referral</Button>}
      />

      <div className="space-y-4">
        {referrals.map((r) => {
          const from = facilityById(r.fromFacilityId);
          const to = facilityById(r.toFacilityId);
          const isComplete = r.status === ReferralStatus.COMPLETED || r.status === ReferralStatus.FOLLOW_UP_SCHEDULED;
          return (
            <Card key={r.id}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{r.id}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.priority === "EMERGENCY" ? "bg-red-100 text-red-700" : r.priority === "URGENT" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-700"
                    }`}>
                      {r.priority}
                    </span>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{r.status.replace(/_/g, " ")}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {from?.name} <ChevronRight className="inline h-3 w-3" /> {to?.name} · {r.specialty}
                  </p>
                  <p className="mt-1 text-sm">{r.reason}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => handleAdvance(r.id)} disabled={isComplete}>
                  {isComplete ? "Completed" : "Advance Step"} {!isComplete && <ArrowRight className="h-3 w-3" />}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Referral">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Referring To</label>
            <Select value={toFacilityId} onChange={(e) => setToFacilityId(e.target.value)}>
              {["dh-1", "chc-1", "phc-1", "phc-2"].map((id) => (
                <option key={id} value={id}>{facilityById(id)?.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Specialty</label>
              <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Priority</label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                <option value="ROUTINE">Routine</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Reason</label>
            <TextArea value={reason} onChange={(e) => setReason(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Clinical Notes</label>
            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Create Referral</Button>
        </form>
      </Modal>
    </div>
  );
}