import { View, Image } from 'react-native';
import {
  ScreenCentered,
  H3,
  BodyText,
  NomadsoftDivider,
  PrimaryButton,
  OutlineButton,
} from '../components/styled';
import { components } from '../styles/globalStyles';

export default function NomadsoftScreen() {
  return (
    <ScreenCentered>
      <View className={`${components.responsive.contentContainer} items-center py-6`}>
        <Image
          source={require('../assets/nomadsoft-black-centered.png')}
          className={components.image.logo}
          resizeMode="contain"
        />
        <H3 className={components.spacing.mb2}>Nomadsoft</H3>
        <NomadsoftDivider />
        <BodyText className="text-lg">For Nomads, By Nomads</BodyText>
      </View>

      <View className={`${components.spacing.mt8} ${components.spacing.gap4}`}>
        <PrimaryButton onPress={() => {}}>Get Started</PrimaryButton>
        <OutlineButton onPress={() => {}}>Learn More</OutlineButton>
      </View>
    </ScreenCentered>
  );
}
