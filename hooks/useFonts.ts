import { useFonts } from 'expo-font';
import {
  Oxanium_200ExtraLight,
  Oxanium_300Light,
  Oxanium_400Regular,
  Oxanium_500Medium,
  Oxanium_600SemiBold,
  Oxanium_700Bold,
  Oxanium_800ExtraBold,
} from '@expo-google-fonts/oxanium';

export const useOxaniumFonts = () => {
  const [fontsLoaded] = useFonts({
    'Oxanium-ExtraLight': Oxanium_200ExtraLight,
    'Oxanium-Light': Oxanium_300Light,
    'Oxanium-Regular': Oxanium_400Regular,
    'Oxanium-Medium': Oxanium_500Medium,
    'Oxanium-SemiBold': Oxanium_600SemiBold,
    'Oxanium-Bold': Oxanium_700Bold,
    'Oxanium-ExtraBold': Oxanium_800ExtraBold,
  });

  return fontsLoaded;
};
