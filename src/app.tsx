import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/utils/AuthContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";

import { PatientDashboard } from "@/pages/patient/dashboard";
import { FindFacilityPage } from "@/pages/patient/find-facility";
import { AppointmentsPage } from "@/pages/patient/appointments";
import { HealthRecordsPage } from "@/pages/patient/health-records";
import { MedicineAvailabilityPage } from "@/pages/patient/medicine-availability";
import { DiagnosticsPage } from "@/pages/patient/diagnostics";
import { ReferralStatusPage } from "@/pages/patient/referral-status";
import { TeleconsultationPage } from "@/pages/patient/teleconsultation";
import { EmergencyPage } from "@/pages/patient/emergency";

import { WorkerDashboard } from "@/pages/healthcare_worker/dashboard";
import { WorkerPatientsPage } from "@/pages/healthcare_worker/patients";
import { TriagePage } from "@/pages/healthcare_worker/triage";
import { WorkerConsultationPage } from "@/pages/healthcare_worker/consultation";
import { HighRiskPage } from "@/pages/healthcare_worker/high-risk";
import { FollowUpsPage } from "@/pages/healthcare_worker/follow-ups";
import { WorkerReferralsPage } from "@/pages/healthcare_worker/referrals";
import { OfflineSyncPage } from "@/pages/healthcare_worker/offline-sync";

import { AdminDashboard } from "@/pages/admin/dashboard";
import { QueuePage } from "@/pages/admin/queue";
import { WorkloadPage } from "@/pages/admin/workload";
import { AdminMedicinesPage } from "@/pages/admin/medicines";
import { AdminReferralsPage } from "@/pages/admin/referrals";
import { AdminHighRiskPage } from "@/pages/admin/high-risk";
import { AdminDiagnosticsPage } from "@/pages/admin/diagnostics";
import { AnalyticsPage } from "@/pages/admin/analytics";

import { NotFoundPage } from "@/pages/utils/NotFound";
import { UserRole } from "@/dto/constants/UserRole";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient portal */}
          <Route
            element={
              <ProtectedRoute roles={[UserRole.PATIENT]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/find-facility" element={<FindFacilityPage />} />
            <Route path="/patient/appointments" element={<AppointmentsPage />} />
            <Route path="/patient/health-records" element={<HealthRecordsPage />} />
            <Route path="/patient/medicine-availability" element={<MedicineAvailabilityPage />} />
            <Route path="/patient/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/patient/referral-status" element={<ReferralStatusPage />} />
            <Route path="/patient/teleconsultation" element={<TeleconsultationPage />} />
            <Route path="/patient/emergency" element={<EmergencyPage />} />
          </Route>

          {/* Worker portal */}
          <Route
            element={
              <ProtectedRoute roles={[UserRole.HEALTHCARE_WORKER]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/worker" element={<WorkerDashboard />} />
            <Route path="/worker/patients" element={<WorkerPatientsPage />} />
            <Route path="/worker/triage" element={<TriagePage />} />
            <Route path="/worker/consultation" element={<WorkerConsultationPage />} />
            <Route path="/worker/high-risk" element={<HighRiskPage />} />
            <Route path="/worker/follow-ups" element={<FollowUpsPage />} />
            <Route path="/worker/referrals" element={<WorkerReferralsPage />} />
            <Route path="/worker/offline-sync" element={<OfflineSyncPage />} />
          </Route>

          {/* Admin portal */}
          <Route
            element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/queue" element={<QueuePage />} />
            <Route path="/admin/workload" element={<WorkloadPage />} />
            <Route path="/admin/medicines" element={<AdminMedicinesPage />} />
            <Route path="/admin/referrals" element={<AdminReferralsPage />} />
            <Route path="/admin/high-risk" element={<AdminHighRiskPage />} />
            <Route path="/admin/diagnostics" element={<AdminDiagnosticsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}