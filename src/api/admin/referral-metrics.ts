import { allReferrals } from "@/lib/mock/referrals";
import type { Referral } from "@/dto/Referral";
import { ReferralStatus } from "@/dto/constants/ReferralStatus";
import { delay } from "../utils/mock-delay";

export interface ReferralMetrics {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  avgJourneyDays: number;
  byStatus: Record<ReferralStatus, number>;
}

export async function getReferralMetrics(): Promise<ReferralMetrics> {
  await delay();
  const byStatus: Record<ReferralStatus, number> = {
    [ReferralStatus.CREATED]: 0,
    [ReferralStatus.SENT]: 0,
    [ReferralStatus.ACCEPTED]: 0,
    [ReferralStatus.ARRIVED]: 0,
    [ReferralStatus.COMPLETED]: 0,
    [ReferralStatus.FOLLOW_UP_SCHEDULED]: 0,
  };
  allReferrals.forEach((r) => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  });
  const completed = allReferrals.filter((r) => r.status === ReferralStatus.COMPLETED).length;
  return {
    total: allReferrals.length,
    completed,
    active: allReferrals.length - completed,
    completionRate: allReferrals.length ? Math.round((completed / allReferrals.length) * 100) : 0,
    avgJourneyDays: 4.5,
    byStatus,
  };
}

export async function getAllReferrals(): Promise<Referral[]> {
  await delay();
  return allReferrals;
}
