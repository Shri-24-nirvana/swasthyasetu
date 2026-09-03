import { allReferrals } from "@/lib/mock/referrals";
import type { Referral } from "@/dto/Referral";
import { ReferralStatus } from "@/dto/constants/ReferralStatus";
import { delay } from "../utils/mock-delay";

export async function getReferrals(facilityId?: string): Promise<Referral[]> {
  await delay();
  if (facilityId) return allReferrals.filter((r) => r.fromFacilityId === facilityId);
  return allReferrals;
}

export async function createReferral(
  input: Omit<Referral, "id" | "status" | "createdAt" | "updatedAt" | "timeline">
): Promise<Referral> {
  await delay();
  const now = new Date().toISOString().slice(0, 10);
  const referral: Referral = {
    ...input,
    id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: ReferralStatus.CREATED,
    createdAt: now,
    updatedAt: now,
    timeline: [{ status: ReferralStatus.CREATED, at: now, by: "Worker" }],
  };
  allReferrals.push(referral);
  return referral;
}

export async function advanceReferralStatus(id: string): Promise<Referral | undefined> {
  await delay();
  const ref = allReferrals.find((r) => r.id === id);
  if (!ref) return undefined;
  const order: ReferralStatus[] = [
    ReferralStatus.CREATED,
    ReferralStatus.SENT,
    ReferralStatus.ACCEPTED,
    ReferralStatus.ARRIVED,
    ReferralStatus.COMPLETED,
    ReferralStatus.FOLLOW_UP_SCHEDULED,
  ];
  const idx = order.indexOf(ref.status);
  if (idx < order.length - 1) {
    const next = order[idx + 1];
    ref.status = next;
    ref.updatedAt = new Date().toISOString().slice(0, 10);
    ref.timeline.push({ status: next, at: ref.updatedAt, by: "Worker" });
  }
  return ref;
}

export async function getReferralById(id: string): Promise<Referral | undefined> {
  await delay(200);
  return allReferrals.find((r) => r.id === id);
}
