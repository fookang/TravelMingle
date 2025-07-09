import { StyleSheet, Text, View } from "react-native";
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ProtectedRoute>
        <View style={styles.content}>
          <Text>Welcome to the profile</Text>
        </View>
      </ProtectedRoute>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  content: {
    flex: 1,
    
  }
});
