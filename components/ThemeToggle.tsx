import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export interface ThemeToggleProps {
  size?: number;
}

export default function ThemeToggle({ size = 24 }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      className="p-2"
      style={{ marginRight: 4 }}>
      <Ionicons 
        name={isDark ? 'sunny' : 'moon'} 
        size={size} 
        color={isDark ? '#FCD34D' : '#4338CA'} 
      />
    </Pressable>
  );
}