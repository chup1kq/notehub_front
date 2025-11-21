import { useEffect, useState } from "react";

export const useTheme = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light-theme"
    );

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) =>
            prev === "light-theme" ? "dark-theme" : "light-theme"
        );
    };

    return { theme, toggleTheme };
};
