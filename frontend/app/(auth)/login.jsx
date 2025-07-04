import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/tokens";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await api.post("user/token/", { username, password });
      SecureStore.setItem(ACCESS_TOKEN, response.data.access);
      SecureStore.setItem(REFRESH_TOKEN, response.data.refresh);
      setError("");
      // router.push("/home");
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
    <View>
      <Text>login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error && <Text>{error}</Text>}
      <Button
        title={loading ? "Loging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
