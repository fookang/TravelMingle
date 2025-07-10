import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/tokens";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useRouter, useFocusEffect } from "expo-router";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const router = useRouter();

  const refreshToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);

      if (!refreshToken) {
        setIsAuthorized(false);
        return;
      }

      const response = await api.post("/user/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      setIsAuthorized(false);
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN);
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      setIsAuthorized(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     let isActive = true;

  //     const run = async () => {
  //       if (isActive) {
  //         await checkAuth();
  //       }
  //     };
  //     run();

  //     return () => {
  //       isActive = false;
  //     };
  //   }, [checkAuth])
  // );

  if (isAuthorized === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthorized) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are not logged in</Text>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (isAuthorized) return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -80,
  },
  text: {
    paddingBottom: 10,
    fontSize: 17,
  },
  button: {
    width: "80%",
    backgroundColor: "#007bff",
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default ProtectedRoute;
