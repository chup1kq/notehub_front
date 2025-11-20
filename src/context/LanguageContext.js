import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import "../static/styles/language.scss";

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = ['RU', 'EN'];
const DEFAULT_LANGUAGE = 'RU';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage_] = useState(DEFAULT_LANGUAGE);

    const getValidLanguage = (lang) => {
        const normalizedLang = lang?.toUpperCase();
        return SUPPORTED_LANGUAGES.includes(normalizedLang) ? normalizedLang : DEFAULT_LANGUAGE;
    };

    const setLanguage = (newLanguage) => {
        const validLanguage = getValidLanguage(newLanguage);
        setLanguage_(validLanguage);
        localStorage.setItem("language", validLanguage);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage) {
            const validLanguage = getValidLanguage(savedLanguage);
            setLanguage_(validLanguage);
            if (validLanguage !== savedLanguage) {
                localStorage.setItem("language", validLanguage);
            }
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            language,
            setLanguage,
        }),
        [language]
    );

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    return useContext(LanguageContext);
};
