import { createContext, useContext, useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/tokens";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);

      if (!refreshToken) {
        setIsAuthenticated(false);
        console.log("No refresh token");
        return;
      }

      const response = await api.post("/user/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, response.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        console.log("failed at refresh");
      }
    } catch (err) {
      setIsAuthenticated(false);
      console.log("Error", err);
    }
  };

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN);
      if (!token) {
        setIsAuthenticated(false);
        console.log("No access token");
        return;
      }

      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      setIsAuthenticated(false);
      console.log("checkAuth error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    Alert.alert(
      "Are you sure you want to logout",
      "If you log out, you will not be able to access your saved data",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Log out",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(ACCESS_TOKEN);
              await SecureStore.deleteItemAsync(REFRESH_TOKEN);
              setIsAuthenticated(false);
              router.replace("/home");
            } catch (err) {
              console.log("Logout error", err);
              Alert.alert("Logout failed", "Please try again.");
            }
          },
        },
      ]
    );
  };

  const login = () => setIsAuthenticated(true);

  const deleteUser = async () => {
    Alert.alert(
      "Are you sure you want to delete your account",
      "If you delete your account, all saved data will be lost",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await api.delete("/user/delete/");
              if (response.status === 204) {
                await Promise.all([
                  SecureStore.deleteItemAsync(ACCESS_TOKEN),
                  SecureStore.deleteItemAsync(REFRESH_TOKEN),
                  AsyncStorage.removeItem("username"),
                  AsyncStorage.removeItem("biometric"),
                ]);

                setIsAuthenticated(false);
                router.replace("/home");
              }
            } catch (error) {
              console.log(error);
              Alert.alert("Delete failed", "Please try again.");
            }
          },
        },
      ]
    );
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
