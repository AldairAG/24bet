// theme/colors.ts
export const Colors = {
    light: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        primary: '#007AFF',
        secondary: '#5856D6',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
        card: '#FFFFFF',
        notification: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
    },
    dark: {
        background: '#000000',
        surface: '#1C1C1E',
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        border: '#38383A',
        card: '#1C1C1E',
        notification: '#FF453A',
        success: '#30D158',
        warning: '#FF9F0A',
        error: '#FF453A',
    },
};

export type ColorScheme = keyof typeof Colors;