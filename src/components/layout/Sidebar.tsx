import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarClock,
  HeartPulse,
  Pill,
  FlaskConical,
  GitPullRequest,
  Video,
  Siren,
  Users,
  Stethoscope,
  AlertTriangle,
  ListChecks,
  Activity,
  CloudOff,
  Loader,
  Workflow,
  ClipboardList,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
// LucideIcon is a type
import { useAuth } from "@/components/utils/AuthContext";
import { UserRole } from "@/dto/constants/UserRole";
import { useLanguage } from "@/components/utils/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: TranslationKey;
  icon: LucideIcon;
}

const patientNav: NavItem[] = [
  { to: "/patient", label: "dashboard", icon: LayoutDashboard },
  { to: "/patient/find-facility", label: "find_facility", icon: Building2 },
  { to: "/patient/appointments", label: "appointments", icon: CalendarClock },
  { to: "/patient/health-records", label: "health_records", icon: HeartPulse },
  { to: "/patient/medicine-availability", label: "medicine_availability", icon: Pill },
  { to: "/patient/diagnostics", label: "diagnostics", icon: FlaskConical },
  { to: "/patient/referral-status", label: "referral_status", icon: GitPullRequest },
  { to: "/patient/teleconsultation", label: "teleconsultation", icon: Video },
  { to: "/patient/emergency", label: "emergency", icon: Siren },
];

const workerNav: NavItem[] = [
  { to: "/worker", label: "dashboard", icon: LayoutDashboard },
  { to: "/worker/patients", label: "patients", icon: Users },
  { to: "/worker/triage", label: "triage", icon: ListChecks },
  { to: "/worker/consultation", label: "begin_consultation", icon: Stethoscope },
  { to: "/worker/high-risk", label: "high_risk", icon: AlertTriangle },
  { to: "/worker/follow-ups", label: "follow_ups", icon: CalendarClock },
  { to: "/worker/referrals", label: "referrals", icon: Workflow },
  { to: "/worker/offline-sync", label: "offline_sync", icon: CloudOff },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "dashboard", icon: LayoutDashboard },
  { to: "/admin/queue", label: "queue", icon: ClipboardList },
  { to: "/admin/workload", label: "workload", icon: Activity },
  { to: "/admin/medicines", label: "medicine_availability", icon: Pill },
  { to: "/admin/referrals", label: "referral_status", icon: Loader },
  { to: "/admin/high-risk", label: "high_risk", icon: AlertTriangle },
  { to: "/admin/diagnostics", label: "diagnostics", icon: FlaskConical },
  { to: "/admin/analytics", label: "analytics", icon: Activity },
];

const navByRole: Record<UserRole, NavItem[]> = {
  [UserRole.PATIENT]: patientNav,
  [UserRole.HEALTHCARE_WORKER]: workerNav,
  [UserRole.ADMIN]: adminNav,
};

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { userRole } = useAuth();
  const { t } = useLanguage();
  if (!userRole) return null;
  const nav = navByRole[userRole];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="font-semibold text-fg">{t("app_name")}</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted hover:text-fg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-700 text-white"
                    : "text-muted hover:bg-brand-50 hover:text-fg"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {t(item.label)}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}