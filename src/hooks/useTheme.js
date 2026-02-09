import { useContext } from 'react';
import { ThemeContext } from '../../App';
import { getThemeColors } from '../../theme/colors';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  const { theme, setTheme, toggleTheme, isAuto, setIsAuto, isDark } = context;
  const colors = getThemeColors(theme);
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isAuto,
    setIsAuto,
    isDark,
    colors
  };
};