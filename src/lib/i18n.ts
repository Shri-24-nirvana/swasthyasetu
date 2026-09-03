import type { Language } from "@/dto/constants/Language";

export type TranslationKey =
  | "app_name"
  | "tagline"
  | "login"
  | "register"
  | "logout"
  | "dashboard"
  | "find_facility"
  | "appointments"
  | "health_records"
  | "medicine_availability"
  | "diagnostics"
  | "referral_status"
  | "teleconsultation"
  | "emergency"
  | "patients"
  | "triage"
  | "high_risk"
  | "follow_ups"
  | "referrals"
  | "offline_sync"
  | "queue"
  | "workload"
  | "analytics"
  | "search"
  | "welcome"
  | "logout_confirm"
  | "view_record"
  | "begin_consultation";

const en: Record<TranslationKey, string> = {
  app_name: "SwasthyaSetu",
  tagline: "Scan. Verify. Continue Care.",
  login: "Login",
  register: "Register",
  logout: "Logout",
  dashboard: "Dashboard",
  find_facility: "Find Facility",
  appointments: "Appointments",
  health_records: "Health Records",
  medicine_availability: "Medicine Availability",
  diagnostics: "Diagnostics",
  referral_status: "Referral Status",
  teleconsultation: "Teleconsultation",
  emergency: "Emergency",
  patients: "Patients",
  triage: "Triage",
  high_risk: "High Risk",
  follow_ups: "Follow-ups",
  referrals: "Referrals",
  offline_sync: "Offline Sync",
  queue: "Patient Queue",
  workload: "Facility Workload",
  analytics: "Analytics",
  search: "Search",
  welcome: "Welcome",
  logout_confirm: "Are you sure you want to logout?",
  view_record: "View Record",
  begin_consultation: "Begin Consultation",
};

const hi: Record<TranslationKey, string> = {
  app_name: "स्वास्थ्यसेतु",
  tagline: "स्कैन करें। पुष्टि करें। उपचार जारी रखें।",
  login: "लॉग इन",
  register: "पंजीकरण",
  logout: "लॉग आउट",
  dashboard: "डैशबोर्ड",
  find_facility: "सुविधा खोजें",
  appointments: "अपॉइंटमेंट",
  health_records: "स्वास्थ्य रिकॉर्ड",
  medicine_availability: "दवा उपलब्धता",
  diagnostics: "निदान रिपोर्ट",
  referral_status: "रेफरल स्थिति",
  teleconsultation: "टेलीकंसल्टेशन",
  emergency: "आपातकाल",
  patients: "मरीज़",
  triage: "त्राइएज",
  high_risk: "उच्च जोखिम",
  follow_ups: "फॉलो-अप",
  referrals: "रेफरल",
  offline_sync: "ऑफ़लाइन सिंक",
  queue: "मरीज़ कतार",
  workload: "सुविधा कार्यभार",
  analytics: "विश्लेषण",
  search: "खोजें",
  welcome: "स्वागत है",
  logout_confirm: "क्या आप लॉग आउट करना चाहते हैं?",
  view_record: "रिकॉर्ड देखें",
  begin_consultation: "परामर्श शुरू करें",
};

const dict: Record<Language, Record<TranslationKey, string>> = { en, hi };

export function translate(lang: Language, key: TranslationKey): string {
  return dict[lang][key];
}

export { dict };