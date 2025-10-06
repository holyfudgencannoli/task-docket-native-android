import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint={Platform.OS === "ios" ? "systemChromeMaterial" : "dark"}
      intensity={100}
      style={StyleSheet.absoluteFillObject}
    />
  );
}

export function useBottomTabOverflow() {
  try {
    return useBottomTabBarHeight();
  } catch {
    return 0; // fallback if no bottom tab bar
  }
}

