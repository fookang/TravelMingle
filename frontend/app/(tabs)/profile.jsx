import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/tokens";
import api from "../../services/api";

const profile = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);


  const refreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
    try {
      const response = await api.post("/user/token/refresh", {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, response.data.access);
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    } catch (err) {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN);

      // If user is not login
      if (!token) {
        router.replace("/login");
        return;
      }

      // Check if ACCESS_TOKEN is expired, refresh it if expired
      // If REFRESH TOKEN is expired also, direct user to login

      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsLogin(true);
      }
    };
    checkAuth();
  }, []);

  if (!isLogin) {
    return null;
  }
  if (loading)
  return (
    <View>
      <Text>Welcome to the profile</Text>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
