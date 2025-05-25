/**
 * E-commerce app color scheme with modern, clean design
 * Optimized for both light and dark modes
 */

const primaryColor = '#6366f1'; // Modern indigo
const primaryColorDark = '#818cf8';
const successColor = '#10b981'; // Green for success states
const errorColor = '#ef4444'; // Red for errors
const warningColor = '#f59e0b'; // Amber for warnings
const accentColor = '#ec4899'; // Pink accent for highlights

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceSecondary: '#f1f5f9',
    border: '#e2e8f0',
    primary: primaryColor,
    primaryText: '#ffffff',
    secondary: '#64748b',
    success: successColor,
    error: errorColor,
    warning: warningColor,
    accent: accentColor,
    tint: primaryColor,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: primaryColor,
    cardBackground: '#ffffff',
    cardShadow: '#0f172a15',
    price: '#059669',
    priceHighlight: '#dc2626',
    badge: '#dc2626',
    badgeText: '#ffffff',
  },
  dark: {
    text: '#f8fafc',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    border: '#475569',
    primary: primaryColorDark,
    primaryText: '#ffffff',
    secondary: '#94a3b8',
    success: successColor,
    error: errorColor,
    warning: warningColor,
    accent: accentColor,
    tint: primaryColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: primaryColorDark,
    cardBackground: '#1e293b',
    cardShadow: '#00000040',
    price: '#10b981',
    priceHighlight: '#ef4444',
    badge: '#ef4444',
    badgeText: '#ffffff',
  },
};
