import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isAuto, setIsAuto] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on app start
  useEffect(() => {
    loadTheme();
  }, []);

  // Listen for system theme changes when auto mode is enabled
  useEffect(() => {
    if (isAuto) {
      const systemTheme = Appearance.getColorScheme();
      setTheme(systemTheme || 'light');
      setIsDark(systemTheme === 'dark');
    }
  }, [isAuto]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('appTheme');
      const savedAuto = await AsyncStorage.getItem('themeAuto');
      
      if (savedTheme) {
        setTheme(savedTheme);
        setIsDark(savedTheme === 'dark');
      } else if (isAuto) {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme || 'light');
        setIsDark(systemTheme === 'dark');
      }
      
      if (savedAuto !== null) {
        setIsAuto(JSON.parse(savedAuto));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDark(newTheme === 'dark');
    saveTheme(newTheme);
    setIsAuto(false);
  };

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    setIsDark(newTheme === 'dark');
    saveTheme(newTheme);
    setIsAuto(false);
  };

  const handleSetIsAuto = async (value) => {
    setIsAuto(value);
    try {
      await AsyncStorage.setItem('themeAuto', JSON.stringify(value));
      
      if (value) {
        // When enabling auto mode, clear saved theme and use system theme
        await AsyncStorage.removeItem('appTheme');
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme || 'light');
        setIsDark(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error saving auto theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        toggleTheme,
        isAuto,
        setIsAuto: handleSetIsAuto,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};