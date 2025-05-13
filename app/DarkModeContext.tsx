import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, Animated } from 'react-native';

type ThemeContextType = {
  darkModeEnabled: boolean;
  toggleDarkMode: () => void;
  backgroundColorAnim: Animated.Value;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const backgroundColorAnim = new Animated.Value(0); // 0: light, 1: dark

  const toggleDarkMode = () => {
    const newDarkMode = !darkModeEnabled;
    setDarkModeEnabled(newDarkMode);
    Animated.timing(backgroundColorAnim, {
      toValue: newDarkMode ? 1 : 0,
      duration: 500, // 過渡時間 (毫秒)
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    // 可以根據系統主題自動設定（可選）
    const colorScheme = Appearance.getColorScheme();
    const initialDarkMode = colorScheme === 'dark';

    setDarkModeEnabled(initialDarkMode);
    Animated.timing(backgroundColorAnim, {
      toValue: initialDarkMode ? 1 : 0,
      duration: 500, // 平滑過渡
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <ThemeContext.Provider value={{ darkModeEnabled, toggleDarkMode, backgroundColorAnim }}>
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
