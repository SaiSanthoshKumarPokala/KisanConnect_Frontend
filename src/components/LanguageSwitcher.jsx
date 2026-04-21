import { useLanguage } from "../context/LanguageContext";

const LANGS = [
  { code: "en", label: "EN",  title: "English" },
  { code: "hi", label: "हि",  title: "हिन्दी" },
  { code: "te", label: "తె",  title: "తెలుగు" },
];

export default function LanguageSwitcher({ collapsed = false }) {
  const { language, changeLanguage } = useLanguage();

  if (collapsed) {
    // Compact icon-only version for collapsed sidebar
    const current = LANGS.find((l) => l.code === language);
    return (
      <div className="flex flex-col items-center gap-1">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            title={lang.title}
            style={{
              width: 32, height: 24,
              background: language === lang.code
                ? "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)"
                : "transparent",
              border: language === lang.code
                ? "none"
                : "1px solid rgba(212,175,55,0.3)",
              borderRadius: 6,
              color: language === lang.code ? "#111" : "#D4AF37",
              fontSize: 10,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: 10,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {LANGS.map((lang, i) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          title={lang.title}
          style={{
            flex: 1,
            padding: "7px 4px",
            background: language === lang.code
              ? "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)"
              : "transparent",
            border: "none",
            borderRight: i < LANGS.length - 1 ? "1px solid rgba(212,175,55,0.2)" : "none",
            color: language === lang.code ? "#111111" : "#D4AF37",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: 0.3,
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
