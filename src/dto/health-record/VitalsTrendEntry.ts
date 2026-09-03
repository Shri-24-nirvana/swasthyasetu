export interface VitalsTrendEntry {
  date: string;
  bpSys: number;
  bpDia: number;
  heartRate: number;
  glucose?: number;
  riskLevel: string;
}
