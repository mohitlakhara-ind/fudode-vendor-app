import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(deviceColorScheme ?? 'light');

  useEffect(() => {
    const loadTheme = async () => {
      // Small delay to ensure native modules are ready
      await new Promise(resolve => setTimeout(resolve, 50));
      try {
        const savedMode = await AsyncStorage.getItem('themeMode');
        if (savedMode) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (e) {
        // Fallback silently if it still fails on first boot
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setColorScheme(deviceColorScheme ?? 'light');
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode, deviceColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (e) {
      console.warn('[ThemeContext] AsyncStorage not available or failed to save:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, colorScheme, isDark: colorScheme === 'dark', setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
