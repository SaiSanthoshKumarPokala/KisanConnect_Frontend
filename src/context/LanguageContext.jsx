import { createContext, useContext, useState } from "react";
import translations from "./translations";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(
        () => localStorage.getItem("kc_language") || "en"
    );

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("kc_language", lang);
    };

    // t(key) — returns the translated string for the current language
    // Falls back to English if key or translation is missing
    const t = (key) => {
        const entry = translations[key];
        if (!entry) return key;
        return entry[language] || entry["en"] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
