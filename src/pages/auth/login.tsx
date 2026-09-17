import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse, Sparkles, ArrowRight, Mail, User as UserIcon, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LanguageSwitch } from "@/components/shared/LanguageSwitch";
import { useLanguage } from "@/components/utils/LanguageContext";
import { UserRole } from "@/dto/constants/UserRole";
import { demoAccounts } from "@/lib/database/seedData";
import { roleRoutes } from "@/components/shared/DemoSwitcher";
import { isSupabaseConfigured } from "@/lib/supabase";

export function LoginPage() {
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"ID_DEMO" | "EMAIL_PASSWORD">("ID_DEMO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const loginUser = useAuthStore((s) => s.loginUser);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const hasSupabase = isSupabaseConfigured();

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(identifier.trim(), role, password || undefined);
      navigate(roleRoutes[role]);
    } catch {
      setError("Login failed. Please verify your credentials or select a demo account.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (account: (typeof demoAccounts)[0]) => {
    loginUser(account.user);
    navigate(roleRoutes[account.role]);
  };

  const currentRoleDemoAccounts = demoAccounts.filter((a) => a.role === role);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <Card className="w-full max-w-xl shadow-2xl overflow-hidden p-0 border border-brand-500/30">
        {/* Top Branding Banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-teal-700 p-6 text-white text-center relative shadow-md">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white shadow-inner">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">{t("app_name")}</h1>
          <p className="text-xs text-brand-100 mt-1 font-medium">{t("tagline")}</p>
          
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
              hasSupabase ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30" : "bg-white/15 text-brand-100"
            }`}>
              <Zap className="h-3 w-3" />
              {hasSupabase ? t("realtime_connected") : t("local_synced")}
            </span>
            <LanguageSwitch />
          </div>
        </div>

        <div className="p-6 space-y-5 bg-surface">
          {/* Auth Mode Tabs */}
          <div className="flex rounded-xl bg-surface-secondary p-1 border border-border">
            <button
              type="button"
              onClick={() => setAuthMode("ID_DEMO")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "ID_DEMO" ? "bg-surface text-brand-700 dark:text-brand-300 border border-border shadow-xs" : "text-muted hover:text-fg"
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" /> {t("swasthya_id")} &amp; Demo
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("EMAIL_PASSWORD")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "EMAIL_PASSWORD" ? "bg-surface text-brand-700 dark:text-brand-300 border border-border shadow-xs" : "text-muted hover:text-fg"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Supabase Email / Password
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-fg">
                {t("select_role")}
              </label>
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as UserRole);
                  setIdentifier("");
                }}
              >
                <option value={UserRole.PATIENT}>{t("role_patient")}</option>
                <option value={UserRole.DOCTOR}>{t("role_doctor")}</option>
                <option value={UserRole.HOSPITAL_STAFF}>{t("role_hospital_staff")}</option>
                <option value={UserRole.LAB}>{t("role_lab")}</option>
                <option value={UserRole.PHARMACY}>{t("role_pharmacy")}</option>
                <option value={UserRole.HEALTHCARE_WORKER}>{t("role_healthcare_worker")}</option>
                <option value={UserRole.ADMIN}>{t("role_admin")}</option>
                <option value={UserRole.SECURITY}>{t("role_security")}</option>
                <option value={UserRole.SUPER_ADMIN}>{t("role_super_admin")}</option>
              </Select>
            </div>

            {authMode === "ID_DEMO" ? (
              <div>
                <label className="mb-1 block text-xs font-semibold text-fg">
                  {t("swasthya_id")} / Username
                </label>
                <Input
                  placeholder={`e.g. ${currentRoleDemoAccounts[0]?.username || "patient01"} or SS-IND-00024581`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-fg">Email Address</label>
                  <Input
                    type="email"
                    placeholder="doctor.anita@swasthyasetu.org"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-fg">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

            <Button type="submit" className="w-full cursor-pointer shadow-md font-bold" disabled={loading}>
              {loading ? "Signing in…" : `${t("login")}`}
            </Button>
          </form>

          {/* 1-Click Demo Accounts Selector for the Chosen Role */}
          {authMode === "ID_DEMO" && (
            <div className="rounded-2xl border border-brand-500/30 bg-surface-secondary/50 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                  {t("demo_accounts")} ({currentRoleDemoAccounts.length})
                </span>
                <span className="text-[10px] text-muted">{t("click_any_to_enter")}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {currentRoleDemoAccounts.map((acc) => (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc)}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-left text-xs transition hover:border-brand-500 hover:bg-surface-hover cursor-pointer shadow-2xs group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-fg truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">{acc.user.name.split("(")[0]}</p>
                      <p className="text-[10px] text-muted font-mono">{acc.username}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
            <span className="text-muted">New citizen or medical staff?</span>
            <Link to="/register" className="font-bold text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1">
              {t("register")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}