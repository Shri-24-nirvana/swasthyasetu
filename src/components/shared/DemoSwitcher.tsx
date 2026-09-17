import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, RefreshCw, ChevronDown, Sparkles, X, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";
import { demoAccounts } from "@/lib/database/seedData";
import { UserRole } from "@/dto/constants/UserRole";
import { useLanguage } from "@/components/utils/LanguageContext";

export const roleRoutes: Record<UserRole, string> = {
  [UserRole.PATIENT]: "/patient",
  [UserRole.HEALTHCARE_WORKER]: "/worker",
  [UserRole.HOSPITAL_STAFF]: "/hospital",
  [UserRole.DOCTOR]: "/doctor",
  [UserRole.LAB]: "/lab",
  [UserRole.PHARMACY]: "/pharmacy",
  [UserRole.ADMIN]: "/admin",
  [UserRole.SECURITY]: "/security",
  [UserRole.SUPER_ADMIN]: "/super-admin",
};

const roleMetaMap: Record<UserRole, { key: string; icon: string; color: string }> = {
  [UserRole.PATIENT]: { key: "role_patient", icon: "🧑‍🦰", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50" },
  [UserRole.DOCTOR]: { key: "role_doctor", icon: "🩺", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/50" },
  [UserRole.HOSPITAL_STAFF]: { key: "role_hospital_staff", icon: "🏢", color: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50" },
  [UserRole.LAB]: { key: "role_lab", icon: "🧪", color: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/50" },
  [UserRole.PHARMACY]: { key: "role_pharmacy", icon: "💊", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50" },
  [UserRole.HEALTHCARE_WORKER]: { key: "role_healthcare_worker", icon: "👩‍⚕️", color: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700/50" },
  [UserRole.ADMIN]: { key: "role_admin", icon: "📊", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/50" },
  [UserRole.SECURITY]: { key: "role_security", icon: "🛡️", color: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/50" },
  [UserRole.SUPER_ADMIN]: { key: "role_super_admin", icon: "⚡", color: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700/50" },
};

export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | "ALL">("ALL");
  const user = useAuthStore((s) => s.user);
  const loginUser = useAuthStore((s) => s.loginUser);
  const resetDatabase = useHospitalDB((s) => s.resetDatabase);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSelectUser = (account: (typeof demoAccounts)[0]) => {
    loginUser(account.user);
    setOpen(false);
    navigate(roleRoutes[account.role]);
  };

  const handleReset = () => {
    if (window.confirm(t("reset_confirm"))) {
      resetDatabase();
      alert(t("reset_done"));
    }
  };

  const filteredAccounts =
    selectedRoleFilter === "ALL"
      ? demoAccounts
      : demoAccounts.filter((a) => a.role === selectedRoleFilter);

  return (
    <>
      {/* Floating Demo Pill Bar */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-1.5 shadow-2xl backdrop-blur-md">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted hidden xs:inline">
          Demo
        </span>
        {user && (
          <span className="hidden sm:inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800 border border-brand-200 truncate max-w-[180px]">
            {roleMetaMap[user.role]?.icon} {user.name}
          </span>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 rounded-full bg-brand-700 dark:bg-brand-500 dark:text-slate-950 px-3 py-1 text-xs font-bold text-white transition hover:bg-brand-600 shadow-sm cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t("switch_role")}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        <button
          onClick={handleReset}
          title={t("reset_demo_database")}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition hover:bg-rose-500/20 hover:text-rose-500 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Demo Switcher Modal / Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-brand-50/60 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
                  <UserCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-fg">{t("role_switcher_title")}</h3>
                  <p className="text-xs text-muted">{t("role_switcher_sub")}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-1.5 text-muted hover:bg-surface-hover hover:text-fg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-border bg-surface p-2.5 text-xs">
              <button
                onClick={() => setSelectedRoleFilter("ALL")}
                className={`rounded-xl px-3 py-1.5 font-bold transition cursor-pointer ${
                  selectedRoleFilter === "ALL"
                    ? "bg-brand-700 text-white shadow-sm dark:bg-brand-500 dark:text-slate-950"
                    : "bg-surface text-muted hover:text-fg border border-border hover:bg-surface-hover"
                }`}
              >
                {t("all_roles")}
              </button>
              {Object.entries(roleMetaMap).map(([roleKey, info]) => (
                <button
                  key={roleKey}
                  onClick={() => setSelectedRoleFilter(roleKey as UserRole)}
                  className={`whitespace-nowrap rounded-xl px-2.5 py-1.5 font-semibold transition cursor-pointer ${
                    selectedRoleFilter === roleKey
                      ? "bg-brand-700 text-white shadow-sm dark:bg-brand-500 dark:text-slate-950"
                      : "bg-surface text-muted hover:text-fg border border-border hover:bg-surface-hover"
                  }`}
                >
                  {t(info.key)}
                </button>
              ))}
            </div>

            {/* Accounts List Grid */}
            <div className="grid flex-1 gap-2.5 overflow-y-auto p-4 sm:grid-cols-2">
              {filteredAccounts.map((acc) => {
                const isCurrent = user?.id === acc.user.id;
                const roleMeta = roleMetaMap[acc.role];
                return (
                  <button
                    key={acc.username}
                    onClick={() => handleSelectUser(acc)}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition hover:border-brand-500 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                      isCurrent
                        ? "border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20"
                        : "border-border bg-surface hover:bg-surface-hover"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl border border-brand-200">
                      {roleMeta?.icon || "👤"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-sm text-fg truncate">{acc.user.name}</p>
                        <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-brand-800">
                          {acc.username}
                        </span>
                      </div>
                      <p className="text-xs text-muted truncate mt-0.5">{acc.description}</p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${roleMeta?.color}`}>
                          {t(roleMeta?.key)}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold text-brand-700">✓ {t("active_user")}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-3.5 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-brand-600" />
                <span>{t("multi_role_active")}</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> {t("reset_demo_database")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
