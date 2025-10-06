// Notifications.ts
import { NativeModules } from 'react-native';

const { NativeNotifications } = NativeModules;

export const showNotification = (title: string, message: string) => {
  if (NativeNotifications?.showNotification) {
    NativeNotifications.showNotification(title, message);
  } else {
    console.warn("NativeNotifications module not linked");
  }
};
