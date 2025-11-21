import { ru } from "../locales/ru.js";
import { en } from "../locales/en.js";

let currentLang = "RU";

export const translations = {
    RU: ru,
    EN: en
};

export function setApiLanguage(lang) {
    currentLang = lang;
}

export function tApi(key, params = {}) {
    const parts = key.split(".");
    let value = translations[currentLang];

    for (const p of parts) {
        value = value?.[p];
    }

    if (!value) return key;

    return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, v),
        value
    );
}
