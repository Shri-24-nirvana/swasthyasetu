export interface Condition {
  condition: string;
  since: string;
  status: "ACTIVE" | "RESOLVED";
  notes?: string;
}
