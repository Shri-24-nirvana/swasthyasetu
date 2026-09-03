import { useLanguage } from "@/components/utils/LanguageContext";
import { Language } from "@/dto/constants/Language";
import { cn } from "@/lib/utils";

export function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border p-1",
        className
      )}
    >
      {[Language.ENGLISH, Language.HINDI].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            language === lang
              ? "bg-brand-700 text-white"
              : "text-muted hover:text-fg"
          )}
        >
          {lang === Language.ENGLISH ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}