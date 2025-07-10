import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/tokens";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "user/token/",
        { username, password },
        { timeout: 5000 }
      );
      SecureStore.setItem(ACCESS_TOKEN, response.data.access);
      SecureStore.setItem(REFRESH_TOKEN, response.data.refresh);
      setError("");
      router.push("/(tabs)/profile");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Invalid credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="login" />

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80,
    paddingHorizontal: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: "80%",
    backgroundColor: "#007bff",
    padding: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#5e7791",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
