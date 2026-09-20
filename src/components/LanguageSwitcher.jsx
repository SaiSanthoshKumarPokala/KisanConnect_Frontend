import { useLanguage } from "../context/LanguageContext";

const LANGS = [
  { code: "en", label: "EN", title: "English" },
  { code: "hi", label: "हि", title: "हिन्दी" },
  { code: "te", label: "తె", title: "తెలుగు" },
];

export default function LanguageSwitcher({ collapsed = false }) {
  const { language, changeLanguage } = useLanguage();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1">
        {LANGS.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              title={lang.title}
              className={`flex h-6 w-8 cursor-pointer items-center justify-center rounded-md text-[10px] font-extrabold transition-all duration-150 ${
                isActive
                  ? "border-none bg-linear-to-br from-gold to-[#FFF085] text-[#111]"
                  : "border border-gold/30 bg-transparent text-gold hover:border-gold/60"
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-0 overflow-hidden rounded-[10px] border border-gold/30 bg-black/35">
      {LANGS.map((lang, i) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => changeLanguage(lang.code)}
            title={lang.title}
            className={`flex-1 cursor-pointer border-none py-1.75 px-1 font-montserrat text-xs font-extrabold tracking-[0.3px] transition-all duration-150 ${
              i < LANGS.length - 1 ? "border-r border-r-gold/20" : ""
            } ${
              isActive
                ? "bg-linear-to-br from-gold to-[#FFF085] text-[#111111]"
                : "bg-transparent text-gold hover:bg-white/5"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}