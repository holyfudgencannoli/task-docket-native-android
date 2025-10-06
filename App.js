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


export default function App() {
    const colorScheme = useColorScheme();
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        if (!Device.isDevice) {
            console.log("Must use a physical device for notifications");
            return;
        }

        let notificationListenerRef = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        let responseListenerRef = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('User tapped notification:', response);
        });

        (async () => {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Permission for notifications not granted!');
                return;
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                });
            }

            console.log("Notification setup complete.");
        })();

        return () => {
            Notifications.removeNotificationSubscription(notificationListenerRef);
            Notifications.removeNotificationSubscription(responseListenerRef);
        };
    }, []);

 
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

