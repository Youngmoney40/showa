import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, useColorScheme } from 'react-native';
import { getThemeColors } from '../../theme/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState('light');
  const [isAuto, setIsAuto] = useState(true);
  const [themeChangeTime, setThemeChangeTime] = useState(Date.now()); 
  
  const colors = getThemeColors(theme);

  // Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const [savedTheme, savedAuto] = await Promise.all([
          AsyncStorage.getItem('appTheme'),
          AsyncStorage.getItem('themeAuto')
        ]);
        
        if (savedAuto !== null) {
          const autoValue = JSON.parse(savedAuto);
          setIsAuto(autoValue);
          
          if (autoValue) {
            setTheme(systemTheme || 'light');
          } else {
            setTheme(savedTheme || 'light');
          }
        } else {
          setTheme(systemTheme || 'light');
          setIsAuto(true);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Update theme when system theme changes in auto mode
  useEffect(() => {
    if (isAuto && systemTheme) {
      setTheme(systemTheme);
      setThemeChangeTime(Date.now()); // Update timestamp
    }
  }, [systemTheme, isAuto]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsAuto(false);
    setThemeChangeTime(Date.now()); // Update timestamp when toggling
    
    AsyncStorage.setItem('appTheme', newTheme);
    AsyncStorage.setItem('themeAuto', JSON.stringify(false));
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    setIsAuto(false);
    setThemeChangeTime(Date.now()); // Update timestamp
    
    AsyncStorage.setItem('appTheme', newTheme);
    AsyncStorage.setItem('themeAuto', JSON.stringify(false));
  };

  const setAutoMode = async (value) => {
    setIsAuto(value);
    
    try {
      await AsyncStorage.setItem('themeAuto', JSON.stringify(value));
      
      if (value) {
        await AsyncStorage.removeItem('appTheme');
        if (systemTheme) {
          setTheme(systemTheme);
          setThemeChangeTime(Date.now()); // Update timestamp
        }
      }
    } catch (error) {
      console.error('Error saving auto theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isAuto,
        toggleTheme,
        setTheme: setThemeMode,
        setIsAuto: setAutoMode,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        themeChangeTime, 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};