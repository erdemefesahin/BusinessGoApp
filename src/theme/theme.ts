// App theme colors and styling constants

export const colors = {
  primary: '#3b5998',
  primaryDark: '#192f6a',
  primaryLight: '#4c669f',
  secondary: '#F99F00',
  secondaryDark: '#DB3069',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#888888',
  lightGray: '#DDDDDD',
  background: '#F5F5F5',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

export const fonts = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as '700',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
};
