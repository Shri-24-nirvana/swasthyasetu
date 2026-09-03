import { allReferrals } from "./referrals";

export const analytics = {
  qrScansTrend: [
    { month: "Mar", count: 820 },
    { month: "Apr", count: 940 },
    { month: "May", count: 1020 },
    { month: "Jun", count: 1210 },
    { month: "Jul", count: 1350 },
    { month: "Aug", count: 1490 },
  ],
  referralCompletionByMonth: [
    { month: "Mar", rate: 55 },
    { month: "Apr", rate: 62 },
    { month: "May", rate: 58 },
    { month: "Jun", rate: 70 },
    { month: "Jul", rate: 74 },
    { month: "Aug", rate: 71 },
  ],
  highRiskDistribution: [
    { condition: "Hypertension", count: 42 },
    { condition: "Diabetes", count: 31 },
    { condition: "Anemia", count: 24 },
    { condition: "COPD", count: 14 },
    { condition: "Tuberculosis", count: 9 },
  ],
  commonConditions: [
    { condition: "Fever / Flu", count: 210 },
    { condition: "Hypertension", count: 168 },
    { condition: "Diabetes", count: 120 },
    { condition: "Diarrhea", count: 85 },
    { condition: "Skin infections", count: 64 },
  ],
  diagnosticsStatus: [
    { label: "Completed", value: 68 },
    { label: "Pending", value: 22 },
    { label: "Reviewed", value: 10 },
  ],
  bedsByFacility: [
    { facility: "Sub-Centre", filled: 1, total: 2 },
    { facility: "Rampur PHC", filled: 18, total: 30 },
    { facility: "Kosi CHC", filled: 45, total: 100 },
    { facility: "District Hosp", filled: 290, total: 500 },
  ],
  referralStatusCounts: {
    created: allReferrals.length,
    completed: allReferrals.filter((r) => r.status === "COMPLETED").length,
    active: allReferrals.filter((r) => ["SENT", "ACCEPTED", "ARRIVED"].includes(r.status)).length,
  },
};
