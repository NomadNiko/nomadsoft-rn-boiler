import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { components, getThemeStyles } from '../styles/globalStyles';

type ButtonProps = {
  title?: string;
  children?: React.ReactNode;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, children, ...touchableProps }, ref) => {
    const { isDark } = useTheme();
    const themeStyles = getThemeStyles(isDark);
    
    // If className is provided, use it; otherwise use default button styles
    const buttonClass = touchableProps.className || `${components.button.base} ${components.button.primary.solid}`;

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={buttonClass}>
        {children || (
          <Text className="text-center text-white font-semibold">
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export default Button;