import { Text, View, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function ProfileScreen() {
  return (
    <View className={globalStyles.container}>
      <Image
        source={require('../assets/nomadsoft-black-centered.png')}
        className={globalStyles.nomadsoftLogoMedium}
        resizeMode="contain"
      />
      <Text className={globalStyles.title}>
        Profile
      </Text>
      <View className={globalStyles.separator} />
      <Text className={globalStyles.subtitle}>
        This is where your profile will be
      </Text>
    </View>
  );
}

