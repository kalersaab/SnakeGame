export const GAME_LOOP_INTERVAL = 100;

export const IS_DEV = true;

export const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
} as const;

export const DEVICE_THRESHOLDS = {
  SMALL_WIDTH: 400,
  SMALL_HEIGHT: 600,
} as const;

export const COLORS = {
  BACKGROUND: '#020617',
  TEXT_PRIMARY: '#f8fafc',
  TEXT_SECONDARY: '#64748b',
  CONTROL_BG: '#0b1b34',
  CONTROL_PRESSED: '#1e40af',
  SUCCESS: '#22c55e',
  SUCCESS_DARK: '#16a34a',
  ERROR: '#ef4444',
  MODAL_BG: '#111',
  METRICS_TEXT: '#22c55e',
  OVERLAY: 'rgba(0, 0, 0, 0.7)',
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.8)',
} as const;

export const SPACING = {
  XS: 6,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 30,
} as const;

export const FONT_SIZES = {
  SM: 10,
  MD: 16,
  LG: 18,
  XL: 22,
  XXL: 24,
  XXXL: 28,
  XXXXL: 32,
  TITLE: 34,
} as const;

export const BUTTON_SIZES = {
  LARGE: {
    WIDTH: 72,
    HEIGHT: 72,
    RADIUS: 36,
  },
  SMALL: {
    WIDTH: 56,
    HEIGHT: 56,
    RADIUS: 28,
  },
  DPAD_WIDTH: 220,
  DPAD_HEIGHT: 280,
  DPAD_SMALL_WIDTH: 180,
  DPAD_SMALL_HEIGHT: 220,
} as const;

export const SHADOWS = {
  SMALL: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  } as any,
  MEDIUM: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
  } as any,
  LARGE: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
  } as any,
  XLARGE: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
    },
    android: {
      elevation: 12,
    },
  } as any,
  XXLARGE: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
    },
    android: {
      elevation: 20,
    },
  } as any,
} as const;
