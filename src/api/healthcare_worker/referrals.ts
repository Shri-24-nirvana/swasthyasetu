import { allReferrals } from "@/lib/mock/referrals";
import type { ReferralResponse } from "@/dto/referral/ReferralResponse";
import type { CreateReferralRequest } from "@/dto/referral/CreateReferralRequest";
import { ReferralStatus } from "@/dto/constants/ReferralStatus";
import { delay } from "../utils/mock-delay";

export async function getReferrals(facilityId?: string): Promise<ReferralResponse[]> {
  await delay();
  if (facilityId) return allReferrals.filter((r) => r.fromFacilityId === facilityId);
  return allReferrals;
}

export async function createReferral(
  input: CreateReferralRequest
): Promise<ReferralResponse> {
  await delay();
  const now = new Date().toISOString().slice(0, 10);
  const referral: ReferralResponse = {
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

export async function advanceReferralStatus(id: string): Promise<ReferralResponse | undefined> {
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

export async function getReferralById(id: string): Promise<ReferralResponse | undefined> {
  await delay(200);
  return allReferrals.find((r) => r.id === id);
}
