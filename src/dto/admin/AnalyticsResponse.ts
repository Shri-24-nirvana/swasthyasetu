export interface AnalyticsResponse {
  qrScansTrend: Array<{ month: string; count: number }>;
  referralCompletionByMonth: Array<{ month: string; rate: number }>;
  highRiskDistribution: Array<{ condition: string; count: number }>;
  commonConditions: Array<{ condition: string; count: number }>;
  diagnosticsStatus: Array<{ label: string; value: number }>;
  bedsByFacility: Array<{ facility: string; filled: number; total: number }>;
}
