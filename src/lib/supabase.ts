import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { HospitalVisit } from "@/dto/visit/HospitalVisit";
import type { Patient } from "@/dto/patient/Patient";

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes("your-project-id") &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes("your-anon-public-key")
  );
};

// Create the Supabase client instance (or a dummy-safe client if not configured)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : "https://placeholder-project.supabase.co",
  isSupabaseConfigured() ? supabaseAnonKey : "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Event type for in-app real-time notification toasts
export interface RealtimeToastEvent {
  id: string;
  type: "VISIT_BOOKED" | "PATIENT_CHECKED_IN" | "CONSULTATION_COMPLETED" | "HIGH_RISK_ALERT" | "INFO";
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

type RealtimeToastListener = (event: RealtimeToastEvent) => void;
const toastListeners: Set<RealtimeToastListener> = new Set();

export const subscribeToRealtimeToasts = (listener: RealtimeToastListener) => {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
};

export const broadcastRealtimeToast = (event: Omit<RealtimeToastEvent, "id" | "timestamp">) => {
  const fullEvent: RealtimeToastEvent = {
    ...event,
    id: `rt-toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  toastListeners.forEach((l) => l(fullEvent));
};

// Type mappings between App DTOs and Supabase DB tables
export function mapVisitToSupabaseRow(v: HospitalVisit) {
  return {
    id: v.id,
    visit_number: v.visitNumber,
    patient_id: v.patientId,
    patient_name: v.patientName,
    patient_age: v.patientAge || null,
    patient_gender: v.patientGender || null,
    facility_id: v.facilityId,
    facility_name: v.facilityName,
    doctor_name: v.doctorName,
    department: v.department,
    status: v.status,
    token_number: v.tokenNumber || null,
    qr_token: v.qrToken,
    reason: v.reason || null,
    vitals: v.vitals ? v.vitals : null,
    diagnosis: v.diagnosis || null,
    clinical_notes: v.clinicalNotes || null,
    risk_level: v.riskLevel || "LOW",
    created_at: v.createdAt || new Date().toISOString(),
    checked_in_at: v.checkedInAt || null,
    consulted_at: v.consultedAt || null,
    completed_at: v.completedAt || null,
  };
}

export function mapSupabaseRowToVisit(row: any): HospitalVisit {
  return {
    id: row.id,
    visitNumber: row.visit_number || row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    patientAge: row.patient_age,
    patientGender: row.patient_gender,
    facilityId: row.facility_id,
    facilityName: row.facility_name,
    doctorName: row.doctor_name,
    department: row.department,
    status: row.status,
    tokenNumber: row.token_number,
    qrToken: row.qr_token,
    reason: row.reason,
    vitals: row.vitals,
    diagnosis: row.diagnosis,
    clinicalNotes: row.clinical_notes,
    riskLevel: row.risk_level,
    createdAt: row.created_at,
    checkedInAt: row.checked_in_at,
    consultedAt: row.consulted_at,
    completedAt: row.completed_at,
  };
}

export function mapPatientToSupabaseRow(p: Patient) {
  return {
    swasthya_id: p.swasthyaId,
    name: p.name,
    role: "PATIENT",
    phone: p.phone || null,
    gender: p.gender,
    age: p.age,
    dob: p.dob || null,
    blood_group: p.bloodGroup || null,
    village: p.village,
    district: p.district,
    state: p.state || "Uttar Pradesh",
    facility_id: p.homeFacilityId || "phc-1",
    emergency_name: p.emergencyContact?.name || null,
    emergency_phone: p.emergencyContact?.phone || null,
    allergies: p.allergies || [],
  };
}

export function mapSupabaseRowToPatient(row: any): Patient {
  return {
    swasthyaId: row.swasthya_id || row.id,
    name: row.name,
    age: row.age || 30,
    gender: row.gender || "Other",
    dob: row.dob || "1995-01-01",
    village: row.village || "Rural Area",
    district: row.district || "Rampur",
    state: row.state || "Uttar Pradesh",
    bloodGroup: row.blood_group || "O+",
    phone: row.phone || "",
    registeredAt: row.registered_at || new Date().toISOString().split("T")[0],
    emergencyContact: row.emergency_name
      ? {
          name: row.emergency_name,
          relationship: "Contact",
          phone: row.emergency_phone || "",
        }
      : undefined,
    riskLevel: row.risk_level || "LOW",
    allergies: row.allergies || [],
    registeredVia: "NORMAL",
    homeFacilityId: row.facility_id || "phc-1",
  };
}
