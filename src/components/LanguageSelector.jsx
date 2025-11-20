import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (lang) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="language-selector">
            <button
                ref={triggerRef}
                className="language-trigger text"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
            >
                {language}
            </button>

            <div
                ref={dropdownRef}
                className={`language-dropdown ${isOpen ? 'open' : ''}`}
            >
                <button
                    className={`language-option ${language === 'RU' ? 'active' : ''}`}
                    onClick={() => selectLanguage('RU')}
                >
                    RU
                </button>
                <button
                    className={`language-option ${language === 'EN' ? 'active' : ''}`}
                    onClick={() => selectLanguage('EN')}
                >
                    EN
                </button>
            </div>
        </div>
    );
};
