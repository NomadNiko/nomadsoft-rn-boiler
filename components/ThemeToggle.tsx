import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles, components } from '../styles/globalStyles';

export interface ThemeToggleProps {
  size?: number;
}

export default function ThemeToggle({ size = 24 }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const theme = getThemeStyles(isDark);

  return (
    <Pressable
      onPress={toggleTheme}
      className={components.button.toggle}
      style={{ marginRight: 4 }}>
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={size}
        color={isDark ? theme.iconColors.moon : theme.iconColors.sun}
      />
    </Pressable>
  );
}
