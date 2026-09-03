import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Language } from "@/dto/constants/Language";
import { translate, type TranslationKey } from "@/lib/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("swasthya-lang");
    return saved === "hi" ? Language.HINDI : Language.ENGLISH;
  });

  const t = (key: TranslationKey) => translate(language, key);

  const value: LanguageContextValue = {
    language,
    setLanguage: (l) => {
      setLanguage(l);
      localStorage.setItem("swasthya-lang", l);
    },
    t,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}