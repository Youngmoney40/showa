// // app theme =============
const colors = {
  primary: '#0d64dd',
  secondary: '#0750b5',
  background: '#F5F5F5',
  text: '#333333',
  white: '#FFFFFF',
  black: '#000000',
};

export default colors;

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#0d64dd',
  secondary: '#081BC3',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#EF4444',
  success: '#10B981',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  input: '#FFFFFF',
};

export const darkTheme = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  primary: '#0d64dd',
  secondary: '#6366F1',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#333333',
  error: '#EF4444',
  success: '#10B981',
  card: '#1E1E1E',
  tabBar: '#1A1A1A',
  input: '#2D2D2D',
};

export const getThemeColors = (theme) => {
  return theme === 'dark' ? darkTheme : lightTheme;
}


