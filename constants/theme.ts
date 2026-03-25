import { Platform } from 'react-native';

const gold = '#facb04';
const goldLight = '#fde68a';
const goldDark = '#b45309';
const crimson = '#b10101';

export const StatusColors = {
  New: '#0066FF',
  Preparing: '#FF8800',
  Ready: '#10B981',
  Late: crimson,
  Delayed: crimson,
  Completed: '#059669',
  Cancelled: '#6B7280',
  All: gold,
};

export const Colors = {
  light: {
    primary: gold,
    primaryLight: goldLight,
    primaryDark: goldDark,
    secondary: crimson,
    text: '#11181C',
    textSecondary: '#687076',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F2F2F7',
    border: 'rgba(0,0,0,0.08)',
    tint: gold,
    icon: '#687076',
    glass: 'rgba(255,255,255,0.7)',
    info: '#0066FF',
    success: '#22BA62',
    error: crimson,
  },
  dark: {
    primary: gold,
    primaryLight: goldLight,
    primaryDark: goldDark,
    secondary: crimson,
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0D0D0D', // Slightly darker
    surface: '#1A1A1A',
    surfaceSecondary: '#2C2C2E',
    border: 'rgba(255,255,255,0.1)',
    tint: gold,
    icon: '#9BA1A6',
    glass: 'rgba(26,26,26,0.7)',
    info: '#3B82F6',
    success: '#22C55E',
    error: crimson,
  },
};

export const Typography = {
  Display: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '700' as const,
  },
  H1: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '600' as const,
  },
  H2: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  H3: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  BodyLarge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  BodyRegular: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400' as const,
  },
  Caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
};

export const Fonts = {
  poppins: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  // Mapping for legacy usage
  sans: 'Inter_400Regular',
  rounded: 'Poppins_600SemiBold',
  medium: 'Inter_500Medium',
  bold: 'Poppins_700Bold',
  mono: 'Inter_400Regular', // Fallback to Inter for mono style
};
