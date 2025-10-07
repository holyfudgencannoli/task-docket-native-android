import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';
import Navigation from './Navigation.js';
import { useColorScheme } from './hooks/useColorScheme';
import { AuthProvider } from './scripts/AuthContext';
import * as React from 'react'
import { Provider as PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import { useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import notifee, {AuthorizationStatus} from '@notifee/react-native';

async function requestPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permission granted.');
    } else {
        console.log('Notification permission denied.');
    }
}

export default function App() {
    const colorScheme = useColorScheme();
    const notificationListener = useRef();
    const responseListener = useRef();


 
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

