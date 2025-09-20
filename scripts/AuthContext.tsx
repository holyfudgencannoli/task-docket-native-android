import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { isJwtExpired } from "./jwt"; // make sure this works in RN too

type User = Record<string, any> | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (userData: User, jwt: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Run once on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");

        if (!savedToken || isJwtExpired(savedToken)) {
          // no token or expired -> clear everything
          setUser(null);
          setToken(null);
          await AsyncStorage.multiRemove(["token", "user"]);
        } else {
          // restore user if available
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(null);
            }
          }
          setToken(savedToken);
        }
      } catch (err) {
        console.error("Error loading auth data", err);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (userData: User, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    await AsyncStorage.setItem("token", jwt);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(["token", "user"]);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
