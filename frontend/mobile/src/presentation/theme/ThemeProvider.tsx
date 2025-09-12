import React, { createContext, useContext, ReactNode } from 'react';
import { ColorSchemeName } from 'react-native';

export interface Theme {
    colors: {
        primary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        success: string;
        warning: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
}

const lightTheme: Theme = {
    colors: {
        primary: '#d32f2f',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        error: '#f44336',
        success: '#4caf50',
        warning: '#ff9800',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

const darkTheme: Theme = {
    colors: {
        primary: '#ff5252',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#333333',
        error: '#f44336',
        success: '#4caf50',
        warning: '#ff9800',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    colorScheme: ColorSchemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, colorScheme }) => {
    const isDark = colorScheme === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};