"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "blue" | "gold" | "green";
type Font = "sans" | "serif";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    font: Font;
    setFont: (font: Font) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("default");
    const [font, setFont] = useState<Font>("sans");

    useEffect(() => {
        const savedTheme = localStorage.getItem("app-theme") as Theme;
        const savedFont = localStorage.getItem("app-font") as Font;

        if (savedTheme) setTheme(savedTheme);
        if (savedFont) setFont(savedFont);
    }, []);

    useEffect(() => {
        const root = window.document.body;

        // Theme Colors
        root.classList.remove("theme-blue", "theme-gold", "theme-green");
        if (theme !== "default") {
            root.classList.add(`theme-${theme}`);
        }
        localStorage.setItem("app-theme", theme);

        // Fonts
        root.classList.remove("font-sans", "font-serif");
        root.classList.add(`font-${font}`);
        localStorage.setItem("app-font", font);

    }, [theme, font]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, font, setFont }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
