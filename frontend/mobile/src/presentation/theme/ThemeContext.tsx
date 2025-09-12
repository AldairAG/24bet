// theme/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from './colors';

interface ThemeContextType {
    colorScheme: ColorScheme;
    colors: typeof Colors.light;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const colorScheme: ColorScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
    const colors = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <ThemeContext.Provider value={{ colorScheme, colors, isDark }}>
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