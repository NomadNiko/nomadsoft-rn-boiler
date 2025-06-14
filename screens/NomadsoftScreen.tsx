import { Text, View, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function NomadsoftScreen() {
  return (
    <View className={globalStyles.container}>
      <Image
        source={require('../assets/nomadsoft-black-centered.png')}
        className={globalStyles.nomadsoftLogoMedium}
        resizeMode="contain"
      />
      <Text className={globalStyles.title}>
        Nomadsoft
      </Text>
      <View className={globalStyles.separator} />
      <Text className={globalStyles.subtitle}>
        For Nomads, By Nomads
      </Text>
    </View>
  );
}
