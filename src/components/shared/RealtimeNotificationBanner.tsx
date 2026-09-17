import { useEffect, useState } from "react";
import {
  Zap,
  CalendarPlus,
  CheckCircle2,
  Stethoscope,
  AlertTriangle,
  X,
  Database,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  subscribeToRealtimeToasts,
  RealtimeToastEvent,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { useHospitalDB } from "@/lib/database/db";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function RealtimeNotificationBanner() {
  const [toasts, setToasts] = useState<RealtimeToastEvent[]>([]);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const initRealtimeSync = useHospitalDB((s) => s.initRealtimeSync);
  const isConnected = isSupabaseConfigured();

  useEffect(() => {
    const unsubRealtime = initRealtimeSync();

    const unsubToasts = subscribeToRealtimeToasts((event) => {
      setToasts((prev) => [event, ...prev.slice(0, 4)]);

      // Auto dismiss after 6s
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== event.id));
      }, 6000);
    });

    return () => {
      unsubRealtime();
      unsubToasts();
    };
  }, [initRealtimeSync]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const sqlSchema = `-- SwasthyaSetu Supabase Realtime Quick Setup
ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.high_risk_alerts;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Real-Time Live Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let Icon = Zap;
          let colorClass = "border-blue-500 bg-blue-900/90 text-white";

          if (toast.type === "VISIT_BOOKED") {
            Icon = CalendarPlus;
            colorClass = "border-brand-400 bg-gradient-to-r from-brand-900 to-teal-900 text-white";
          } else if (toast.type === "PATIENT_CHECKED_IN") {
            Icon = CheckCircle2;
            colorClass = "border-emerald-400 bg-gradient-to-r from-emerald-900 to-teal-950 text-white";
          } else if (toast.type === "CONSULTATION_COMPLETED") {
            Icon = Stethoscope;
            colorClass = "border-indigo-400 bg-gradient-to-r from-indigo-900 to-purple-950 text-white";
          } else if (toast.type === "HIGH_RISK_ALERT") {
            Icon = AlertTriangle;
            colorClass = "border-red-400 bg-gradient-to-r from-red-950 to-amber-950 text-white animate-bounce";
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border-2 p-3.5 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 ${colorClass}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-tight text-white">{toast.title}</p>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-white/70 hover:text-white p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-white/90 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
                <span className="text-[9px] text-white/60 font-mono mt-1 block">
                  {new Date(toast.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Supabase Connection Setup Modal */}
      <Modal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        title="Supabase Realtime Cloud Integration"
        className="max-w-lg"
      >
        <div className="space-y-4 text-xs text-fg">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-brand-50/50 p-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white ${
                isConnected ? "bg-emerald-600" : "bg-amber-500"
              }`}
            >
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">
                Status: {isConnected ? "🟢 Connected to Supabase Cloud" : "🟡 Local Emulated State"}
              </p>
              <p className="text-muted text-[11px]">
                {isConnected
                  ? "Real-time subscriptions are active across Doctor, Patient, and Hospital portals."
                  : "Using local reactive state. Add your Supabase credentials in .env to connect live cloud DB."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-fg">How to link your live Supabase project:</p>
            <ol className="list-decimal pl-4 space-y-1 text-muted">
              <li>
                Create a free project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand-700 underline inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Open the file <code className="bg-muted/20 px-1 py-0.5 rounded">.env</code> in your project root.
              </li>
              <li>
                Paste your <code className="bg-muted/20 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and{" "}
                <code className="bg-muted/20 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.
              </li>
              <li>Run the SQL schema in your Supabase SQL Editor.</li>
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-muted">Realtime Publication SQL</span>
              <Button size="sm" variant="outline" onClick={copySql} className="h-7 text-xs">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy SQL"}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-2.5 font-mono text-[10px] text-emerald-400">
              {sqlSchema}
            </pre>
          </div>

          <Button className="w-full" onClick={() => setSetupModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function RealtimeStatusBadge({ onClick }: { onClick?: () => void }) {
  const isConnected = isSupabaseConfigured();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold transition ${
        isConnected
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          : "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
      }`}
      title="Click to view Supabase Realtime details"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            isConnected ? "bg-emerald-400" : "bg-brand-400"
          }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isConnected ? "bg-emerald-500" : "bg-brand-600"
          }`}
        />
      </span>
      <span className="hidden sm:inline">
        {isConnected ? "⚡ Supabase Realtime" : "⚡ Realtime Synced"}
      </span>
    </button>
  );
}
