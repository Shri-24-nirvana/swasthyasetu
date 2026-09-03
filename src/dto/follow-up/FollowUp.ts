export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  dueDate: string;
  reason: string;
  status: "SCHEDULED" | "DUE" | "OVERDUE" | "COMPLETED";
  specialty?: string;
}
