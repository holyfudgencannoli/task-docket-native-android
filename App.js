import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';
import Navigation from './Navigation.js';
import { useColorScheme } from './hooks/useColorScheme';
import { AuthProvider } from './scripts/AuthContext.tsx';
import * as React from 'react'
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  const colorScheme = useColorScheme();

 
  return (
        <AuthProvider>
            <PaperProvider>
                <ThemeProvider>
                    <Navigation  value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} />
                </ThemeProvider>
            </PaperProvider>
        </AuthProvider>
  );
}

