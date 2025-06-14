import './global.css';

import 'react-native-gesture-handler';

import RootStack from './navigation';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}