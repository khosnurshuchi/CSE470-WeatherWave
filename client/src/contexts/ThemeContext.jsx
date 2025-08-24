import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Apply theme to document root
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const getThemeStyles = () => {
        if (theme === 'dark') {
            return {
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                cardBackground: 'rgba(255, 255, 255, 0.1)',
                textPrimary: '#ffffff',
                textSecondary: 'rgba(255, 255, 255, 0.8)',
                border: 'rgba(255, 255, 255, 0.2)',
                shadow: 'rgba(0, 0, 0, 0.3)'
            };
        } else {
            return {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                cardBackground: 'rgba(255, 255, 255, 0.2)',
                textPrimary: '#ffffff',
                textSecondary: 'rgba(255, 255, 255, 0.8)',
                border: 'rgba(255, 255, 255, 0.2)',
                shadow: 'rgba(0, 0, 0, 0.1)'
            };
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, getThemeStyles }}>
            {children}
        </ThemeContext.Provider>
    );
};