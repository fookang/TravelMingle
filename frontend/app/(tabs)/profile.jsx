import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/tokens";
import api from "../../services/api";
import ProtectedRoute from "../components/ProtectedRoute";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";

const profile = () => {
  const router = useRouter();

  const handleLogout = () => {
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
              router.replace("/home");
            } catch (err) {
              console.log("Logout error", err)
              Alert.alert("Logout failed", "Please try again.")
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ProtectedRoute>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => router.push("/(app)/personalDetails")}
            style={styles.button}
          >
            <Text>Personal details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/passwordAndSecurity")}
            style={styles.button}
          >
            <Text>Password & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/paymentOption")}
            style={styles.button}
          >
            <Text>Payment Option</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/deleteAccount")}
            style={styles.button}
          >
            <Text>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.button}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </ProtectedRoute>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
