import { RiskLevel } from "@/dto/constants/RiskLevel";
import type { Vitals } from "@/dto/consultation/Vitals";

export interface RiskEvaluation {
  riskLevel: RiskLevel;
  score: number;
  flags: string[];
}

export function evaluateVitalsRisk(v: Vitals): RiskEvaluation {
  let score = 0;
  const flags: string[] = [];

  if (v.bloodPressureSys >= 160 || v.bloodPressureDia >= 100) {
    score += 3;
    flags.push("Blood pressure critically elevated");
  } else if (v.bloodPressureSys >= 140 || v.bloodPressureDia >= 90) {
    score += 1;
    flags.push("Blood pressure elevated");
  }

  if (v.heartRate >= 120 || v.heartRate <= 50) {
    score += 2;
    flags.push("Heart rate out of range");
  }

  if (v.temperature >= 39) {
    score += 2;
    flags.push("High fever");
  } else if (v.temperature >= 37.5) {
    score += 1;
    flags.push("Mild fever");
  }

  if (v.glucose != null && v.glucose >= 200) {
    score += 2;
    flags.push("Glucose critically high");
  } else if (v.glucose != null && v.glucose >= 140) {
    score += 1;
    flags.push("Glucose elevated");
  }

  if (v.spo2 != null && v.spo2 < 92) {
    score += 3;
    flags.push("Low oxygen saturation");
  } else if (v.spo2 != null && v.spo2 < 95) {
    score += 1;
    flags.push("Oxygen saturation slightly low");
  }

  let riskLevel: RiskLevel = RiskLevel.LOW;
  if (score >= 5) riskLevel = RiskLevel.HIGH;
  else if (score >= 2) riskLevel = RiskLevel.MODERATE;

  return { riskLevel, score, flags };
}

export type Acuity = "RED" | "YELLOW" | "GREEN";

export function triageAcuity(score: number, flagsCount: number): Acuity {
  if (score >= 5 || flagsCount >= 3) return "RED";
  if (score >= 2) return "YELLOW";
  return "GREEN";
}
