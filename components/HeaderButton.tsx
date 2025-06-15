import { forwardRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles } from '../styles/globalStyles';

export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    const { isDark } = useTheme();
    const theme = getThemeStyles(isDark);

    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <Ionicons
            name="skull"
            size={25}
            color={theme.iconColors.close}
            style={[
              styles.headerRight,
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          />
        )}
      </Pressable>
    );
  }
);

HeaderButton.displayName = 'HeaderButton';

export const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});
