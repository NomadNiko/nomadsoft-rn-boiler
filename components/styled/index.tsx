import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextProps,
  ViewProps,
  TextInputProps,
  TouchableOpacityProps,
  PressableProps,
  ScrollViewProps,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeStyles, layout, typography, components } from '../../styles/globalStyles';

// Headings
export const H2 = ({ children, className = '', ...props }: TextProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <Text
      className={`${typography.heading.h2} ${theme.colors.text.primary} ${className}`}
      {...props}>
      {children}
    </Text>
  );
};

export const H3 = ({ children, className = '', ...props }: TextProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <Text
      className={`${typography.heading.h3} ${theme.colors.text.primary} ${className}`}
      {...props}>
      {children}
    </Text>
  );
};

export const H4 = ({ children, className = '', ...props }: TextProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <Text
      className={`${typography.heading.h4} ${theme.colors.text.primary} ${className}`}
      {...props}>
      {children}
    </Text>
  );
};

// Text variants
export const BodyText = ({ children, className = '', ...props }: TextProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <Text
      className={`${typography.body.base} ${theme.colors.text.secondary} ${className}`}
      {...props}>
      {children}
    </Text>
  );
};

export const LabelText = ({ children, className = '', ...props }: TextProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <Text
      className={`${typography.body.sm} ${theme.colors.text.secondary} ${className}`}
      {...props}>
      {children}
    </Text>
  );
};

export const ErrorText = ({ children, className = '', ...props }: TextProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <Text className={`${typography.body.base} ${theme.colors.text.error} ${className}`} {...props}>
      {children}
    </Text>
  );
};

// Containers
export const Screen = ({ children, className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${layout.container.base} ${theme.colors.background.primary} ${className}`}
      {...props}>
      {children}
    </View>
  );
};

export const ScreenScroll = ({ children, className = '', ...props }: ScrollViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <ScrollView
      className={`${layout.container.base} ${theme.colors.background.secondary} ${className}`}
      {...props}>
      {children}
    </ScrollView>
  );
};

export const ScreenCentered = ({ children, className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${layout.container.centered} ${theme.colors.background.primary} ${className}`}
      {...props}>
      {children}
    </View>
  );
};

export const Card = ({ children, className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${components.container.paper} ${theme.colors.background.primary} ${components.shadow.md} ${className}`}
      {...props}>
      {children}
    </View>
  );
};

export const ProfileCard = ({ children, className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${components.container.profileCard} ${theme.colors.background.secondary} ${components.shadow.xl} ${className}`}
      {...props}>
      {children}
    </View>
  );
};

export const Modal = ({ children, className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${components.container.modal} ${theme.colors.background.primary} ${className}`}
      {...props}>
      {children}
    </View>
  );
};

// Layout helpers
export const Row = ({ children, className = '', ...props }: ViewProps) => {
  return (
    <View className={`${layout.flex.row} ${className}`} {...props}>
      {children}
    </View>
  );
};

export const RowBetween = ({ children, className = '', ...props }: ViewProps) => {
  return (
    <View className={`${layout.flex.row} ${layout.flex.between} ${className}`} {...props}>
      {children}
    </View>
  );
};

// Buttons
export const PrimaryButton = ({ children, className = '', ...props }: TouchableOpacityProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <TouchableOpacity
      className={`${components.button.base} ${components.button.primary} ${className}`}
      {...props}>
      <Text className={`${typography.weight.semibold} ${theme.colors.text.white} text-center`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const OutlineButton = ({
  children,
  variant = 'purple',
  className = '',
  ...props
}: TouchableOpacityProps & { variant?: 'purple' }) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <TouchableOpacity
      className={`${components.button.base} ${components.button.outline} ${theme.colors.border[variant]} ${className}`}
      {...props}>
      <Text className={`text-center ${typography.weight.semibold} ${theme.colors.text[variant]}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const SmallButton = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: TouchableOpacityProps & { variant?: 'primary' | 'outline' }) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        className={`${components.button.small} ${components.button.outline} ${theme.colors.border.purple} ${className}`}
        {...props}>
        <Text
          className={`${components.utils.textCenter} ${typography.weight.medium} ${theme.colors.text.purple}`}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`${components.button.small} ${components.button.primary} ${className}`}
      {...props}>
      <Text
        className={`${typography.weight.semibold} ${theme.colors.text.white} ${components.utils.textCenter}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

// Inputs
export const Input = ({ className = '', style, ...props }: TextInputProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <TextInput
      placeholderTextColor={theme.placeholderColor}
      className={`${components.input.base} ${components.input.bordered} ${theme.colors.background.primary} ${theme.colors.border.secondary} ${theme.colors.text.primary} ${className}`}
      style={[{ fontFamily: 'Oxanium-Regular' }, style]}
      {...props}
    />
  );
};

export const FilledInput = ({ className = '', style, ...props }: TextInputProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  const bgColor = isDark ? 'bg-gray-700' : 'bg-gray-100';
  return (
    <TextInput
      placeholderTextColor={theme.placeholderColor}
      className={`${components.input.base} ${bgColor} ${theme.colors.text.primary} ${className}`}
      style={[{ fontFamily: 'Oxanium-Regular' }, style]}
      {...props}
    />
  );
};

// Dividers
export const Divider = ({ className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${components.divider.listDivider} ${theme.colors.background.tertiary} ${className}`}
      {...props}
    />
  );
};

export const NomadsoftDivider = ({ className = '', ...props }: ViewProps) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  return (
    <View
      className={`${components.divider.nomadsoftDivider} ${theme.colors.background.tertiary} ${className}`}
      {...props}
    />
  );
};

// List Item
export const ListItem = ({ children, className = '', ...props }: ViewProps) => {
  return (
    <View className={`${components.listItem.base} ${className}`} {...props}>
      {children}
    </View>
  );
};

// Badge
export const Badge = ({
  children,
  variant = 'indigo',
  className = '',
  ...props
}: ViewProps & { variant?: 'indigo' | 'purple' | 'green' | 'yellow' }) => {
  return (
    <View
      className={`${components.badge.base} ${components.badge[variant].bg} ${className}`}
      {...props}>
      <Text className={components.badge[variant].text}>{children}</Text>
    </View>
  );
};

// Color swatch for demo
export const ColorSwatch = ({ color }: { color: string }) => {
  return <View className={`${components.colorBox} ${color}`} />;
};

// Spacing helpers
export const Spacer = ({ size = 'mt4' }: { size?: keyof typeof components.spacing }) => {
  return <View className={components.spacing[size]} />;
};

// Icon Button
export const IconButton = ({
  children,
  variant = 'default',
  className = '',
  ...props
}: PressableProps & { variant?: 'default' | 'close' }) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  if (variant === 'close') {
    return (
      <Pressable
        className={`${components.button.close} ${theme.colors.background.tertiary} ${className}`}
        {...props}>
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable className={className} {...props}>
      {children}
    </Pressable>
  );
};
