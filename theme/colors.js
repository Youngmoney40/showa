


export const lightColors = {
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#F8F9FA',
  
  // Surface Colors
  surface: '#F8F9FA',
  surfaceSecondary: '#FFFFFF',
  surfaceTertiary: '#F0F2F5',
  
  // Text Colors
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Brand Colors (your existing colors)
  primary: '#0d64dd',
  primaryDark: '#0750b5',
  secondary: '#081BC3',
  accent: '#10B981',
  
  // UI Colors
  border: '#E0E0E0',
  divider: '#E0E0E0',
  card: '#FFFFFF',
  
  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#FF9800',
  info: '#0d64dd',
  
  // Special Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Icon Colors
  icon: '#666666',
  iconActive: '#0d64dd',
  
  // Input Colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputText: '#000000',
  placeholder: '#999999',
  
  // Button Colors
  buttonPrimary: '#0d64dd',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#F0F2F5',
  buttonSecondaryText: '#000000',
  
  // Tab Colors
  tabBackground: '#FFFFFF',
  tabActive: '#0d64dd',
  tabInactive: '#666666',
  
  // Header Colors
  headerBackground: '#FFFFFF',
  headerText: '#000000',
};

export const darkColors = {
  // Background Colors
  background: '#0F0F0F',
  backgroundSecondary: '#1A1A1A',
  backgroundTertiary: '#1E1E1E',
  
  // Surface Colors
  surface: '#1A1A1A',
  surfaceSecondary: '#1E1E1E',
  surfaceTertiary: '#2D2D2D',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#707070',
  textInverse: '#000000',
  
  // Brand Colors (your existing colors)
  primary: '#0d64dd',
  primaryDark: '#0750b5',
  secondary: '#6366F1',
  accent: '#10B981',
  
  // UI Colors
  border: '#333333',
  divider: '#333333',
  card: '#1E1E1E',
  
  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#FF9800',
  info: '#0d64dd',
  
  // Special Colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Icon Colors
  icon: '#A0A0A0',
  iconActive: '#0d64dd',
  
  // Input Colors
  inputBackground: '#2D2D2D',
  inputBorder: '#333333',
  inputText: '#FFFFFF',
  placeholder: '#707070',
  
  // Button Colors
  buttonPrimary: '#0d64dd',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#2D2D2D',
  buttonSecondaryText: '#FFFFFF',
  
  // Tab Colors
  tabBackground: '#1A1A1A',
  tabActive: '#0d64dd',
  tabInactive: '#A0A0A0',
  
  // Header Colors
  headerBackground: '#1A1A1A',
  headerText: '#FFFFFF',
};

// For backward compatibility with your existing code
export const lightTheme = lightColors;
export const darkTheme = darkColors;

export const getThemeColors = (theme = 'light') => {
  return theme === 'dark' ? darkColors : lightColors;
};

export default {
  light: lightColors,
  dark: darkColors,
  getThemeColors,
};
