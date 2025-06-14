import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function NomadsoftTestPopup() {
  return (
    <>
      <View className={globalStyles.container}>
        <Text className={globalStyles.title}>
          Nomadsoft Test Modal
        </Text>
        <View className={globalStyles.separator} />
        <Text className={globalStyles.subtitle}>
          Your Content in a feakin MODAL!
        </Text>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </>
  );
}

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-blue-200`,
  title: `text-xl font-bold text-indigo-700`,
  subtitle: `text-lg text-indigo-800`,
};
