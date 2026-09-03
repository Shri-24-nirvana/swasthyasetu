import type { ReferralStatus } from "@/dto/constants/ReferralStatus";

export interface ReferralMetricsResponse {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  avgJourneyDays: number;
  byStatus: Record<ReferralStatus, number>;
}
