import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { RiskLevel } from "@/dto/constants/RiskLevel";

const tone: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800/60",
  GREEN: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800/60",
  MODERATE: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-800/60",
  YELLOW: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-800/60",
  HIGH: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 dark:border dark:border-rose-800/60",
  RED: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 dark:border dark:border-rose-800/60",
  INFO: "bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300 dark:border dark:border-brand-700/50",
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel | "GREEN" | "YELLOW" | "RED" | "INFO" | "LOW" | "MODERATE" | "HIGH";
  className?: string;
}) {
  const label =
    level === RiskLevel.LOW || level === "GREEN"
      ? "Low"
      : level === RiskLevel.MODERATE || level === "YELLOW"
      ? "Moderate"
      : level === "INFO"
      ? "Info"
      : "High";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs",
        tone[level] || tone.INFO,
        className
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function Badge({
  className,
  tone: t = "INFO",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "INFO" | "GREEN" | "YELLOW" | "RED";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs",
        tone[t] || tone.INFO,
        className
      )}
      {...props}
    />
  );
}