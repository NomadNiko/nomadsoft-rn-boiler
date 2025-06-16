import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getThemeStyles, components } from '../styles/globalStyles';
import {
  Screen,
  Modal,
  H2,
  BodyText,
  LabelText,
  Input,
  FilledInput,
  Row,
  RowBetween,
  SmallButton,
  ColorSwatch,
  Spacer,
  IconButton,
} from '../components/styled';

export default function NomadsoftTestPopup() {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  const navigation = useNavigation();

  return (
    <>
      <Screen className={theme.colors.background.secondary}>
        <View className={`${components.responsive.cardContainer} py-6`}>
          {/* Modal Card */}
          <Modal>
            {/* Header */}
            <RowBetween className={components.spacing.mb6}>
              <H2>Nomadsoft Modal</H2>
              <IconButton variant="close" onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={24} color={theme.iconColors.close} />
              </IconButton>
            </RowBetween>

            {/* Content */}
            <View className={components.utils.spaceY4}>
              <BodyText>
                This is a beautiful modal demonstrating our new design system with support for dark
                and light modes.
              </BodyText>

              {/* Input Examples */}
              <Spacer />
              <LabelText className={components.spacing.mb2}>Default Input</LabelText>
              <Input placeholder="Enter your name" />

              <Spacer />
              <LabelText className={components.spacing.mb2}>Filled Input</LabelText>
              <FilledInput placeholder="Enter email" />

              {/* Color Palette Preview */}
              <Spacer />
              <LabelText className={components.spacing.mb2}>Color Palette</LabelText>
              <Row className={`${components.spacing.mb2} ${components.spacing.gap2}`}>
                <ColorSwatch color={components.colorSwatches.indigo[100]} />
                <ColorSwatch color={components.colorSwatches.indigo[300]} />
                <ColorSwatch color={components.colorSwatches.indigo[500]} />
                <ColorSwatch color={components.colorSwatches.indigo[700]} />
                <ColorSwatch color={components.colorSwatches.indigo[900]} />
              </Row>
              <Row className={components.spacing.gap2}>
                <ColorSwatch color={components.colorSwatches.purple[100]} />
                <ColorSwatch color={components.colorSwatches.purple[300]} />
                <ColorSwatch color={components.colorSwatches.purple[500]} />
                <ColorSwatch color={components.colorSwatches.purple[700]} />
                <ColorSwatch color={components.colorSwatches.purple[900]} />
              </Row>

              {/* Buttons */}
              <Row className={`${components.spacing.mt6} ${components.spacing.gap3}`}>
                <View className={components.utils.flex1}>
                  <SmallButton variant="outline" onPress={() => navigation.goBack()}>
                    Cancel
                  </SmallButton>
                </View>
                <View className={components.utils.flex1}>
                  <SmallButton onPress={() => navigation.goBack()}>Confirm</SmallButton>
                </View>
              </Row>
            </View>
          </Modal>
        </View>
      </Screen>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}
