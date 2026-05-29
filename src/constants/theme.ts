/**
 * FaceAuth Offline - Theme Constants
 * Design tokens for the NHAI Hackathon 7.0 facial recognition app.
 * Dark-themed UI optimized for outdoor kiosk and mobile use.
 */

export const Colors = {
  background: '#0A0A0F',
  card: '#1A1A2E',
  border: '#2D2D44',
  text: '#FFFFFF',
  textSecondary: '#8888AA',
  accent: '#FF6B00',
  accentLight: '#FF8C33',
  accentDark: '#CC5500',
  success: '#00E676',
  successDark: '#00C853',
  error: '#FF1744',
  errorDark: '#D50000',
  warning: '#FFD600',
  warningDark: '#FFAB00',
  info: '#448AFF',
  overlay: 'rgba(10, 10, 15, 0.85)',
  cardElevated: '#22223A',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 48,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.0,
    widest: 2.0,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  accent: {
    shadowColor: '#FF6B00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
} as const;

export const HitSlop = {
  sm: {top: 8, bottom: 8, left: 8, right: 8},
  md: {top: 12, bottom: 12, left: 12, right: 12},
  lg: {top: 16, bottom: 16, left: 16, right: 16},
} as const;

const Theme = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  HitSlop,
} as const;

export type ThemeColors = typeof Colors;
export type ThemeTypography = typeof Typography;
export type ThemeSpacing = typeof Spacing;
export type ThemeBorderRadius = typeof BorderRadius;

export default Theme;
