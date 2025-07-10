import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/tokens";
import ProtectedRoute from "../components/ProtectedRoute";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import Ionicons from "@react-native-vector-icons/ionicons";


const profile = () => {
  const router = useRouter();
  const [key, setKey] = useState(0)

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
              setKey(prev => prev + 1)
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
      <ProtectedRoute key={key}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => router.push("/(app)/personalDetails")}
            style={styles.button}
          >
            <Ionicons name="person-outline" style={styles.icons} />
            <Text style={styles.text}>Personal details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/passwordAndSecurity")}
            style={styles.button}
          >
            <Text style={styles.text}>Password & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/paymentOption")}
            style={styles.button}
          >
            <Text style={styles.text}>Payment Option</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/deleteAccount")}
            style={styles.button}
          >
            <Text style={styles.text}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.button}
          >
            <Text style={styles.text}>Logout</Text>
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
  },
  content: {
    flex: 1,
  },
  button: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icons: {
    fontSize: 20,
    marginRight: 12,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
