import { Feather } from '@expo/vector-icons';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles } from '../styles/globalStyles';
import { Row } from './styled';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  return (
    <Row>
      <Feather name="chevron-left" size={16} color={theme.iconColors.blue} />
      <Text className={`${theme.colors.text.blue} ml-1`} onPress={onPress}>
        Back
      </Text>
    </Row>
  );
};
