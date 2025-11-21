import { useLanguage } from "../context/LanguageContext";
import { ru } from "../locales/ru.js";
import { en } from "../locales/en.js";

const translations = {
    RU: ru,
    EN: en
};

export const useTranslation = () => {
    const { language } = useLanguage();

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return { t, language };
};
