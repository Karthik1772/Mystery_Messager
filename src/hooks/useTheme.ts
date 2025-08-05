'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Function to update theme from localStorage
        const updateTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setIsDark(savedTheme === 'dark');
            } else {
                // Default to system preference
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        };

        // Set initial theme
        updateTheme();

        // Listen for theme changes from navbar
        const handleThemeChange = () => {
            updateTheme();
        };

        window.addEventListener('themeChange', handleThemeChange);

        // Cleanup
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    return isDark;
}