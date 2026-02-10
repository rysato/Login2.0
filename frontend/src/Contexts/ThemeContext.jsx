import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCookie, setCookie } from '../utils/cookieUtils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = getCookie('app_theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        setCookie('app_theme', theme, 365);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);