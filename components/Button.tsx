import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { components } from '../styles/globalStyles';

type ButtonProps = {
  title?: string;
  children?: React.ReactNode;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, children, ...touchableProps }, ref) => {
    // If className is provided, use it; otherwise use default button styles
    const buttonClass =
      touchableProps.className || `${components.button.base} ${components.button.primary}`;

    return (
      <TouchableOpacity ref={ref} {...touchableProps} className={buttonClass}>
        {children || <Text className="text-center font-semibold text-white">{title}</Text>}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export default Button;
