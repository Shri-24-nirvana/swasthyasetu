import { analytics } from "@/lib/mock/analytics";
import type { DashboardStats } from "@/dto/admin/DashboardStats";
import type { AnalyticsResponse } from "@/dto/admin/AnalyticsResponse";
import { dashboardStats } from "@/lib/mock/dashboard";
import { delay } from "../utils/mock-delay";

export async function getAnalytics(): Promise<AnalyticsResponse> {
  await delay();
  return analytics;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  return dashboardStats;
}
