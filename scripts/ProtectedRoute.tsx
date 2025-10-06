// ProtectedRoute.tsx (or .jsx if not using TS)
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./AuthContext"; // <- your context

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    // If no token, redirect to Login
    // Use React Navigation for navigation instead of <Navigate>
    return null; // or <LoginScreen />
  }

  return children;
}
