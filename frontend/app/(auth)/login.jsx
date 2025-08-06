import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  USERNAME,
  PASSWORD,
} from "../../constants/tokens";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const handleLogin = async ({
    biometric = false,
    inputUsername,
    inputPassword,
  }) => {
    if (loading) return;

    const user = biometric ? inputUsername : username;
    const pass = biometric ? inputPassword : password;
    if ((!user?.trim() || !pass?.trim()) && !biometric) {
      setError("Please fill in both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "user/token/",
        { username: user, password: pass },
        { timeout: 5000 }
      );
      await SecureStore.setItemAsync(ACCESS_TOKEN, response.data.access);
      await SecureStore.setItemAsync(REFRESH_TOKEN, response.data.refresh);
      await AsyncStorage.setItem("username", user);

      login();
      router.push("/(tabs)/home");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Invalid credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  const useBiometric = async () => {
    if (loading) return;

    try {
      const value = await AsyncStorage.getItem("biometric");
      if (value === "true") {
        const biometricAuth = await LocalAuthentication.authenticateAsync({
          promptMessage: "Log in with Biometric",
          cancelLabel: "Cancel",
          disableDeviceFallback: true,
        });
        if (biometricAuth.success === true) {
          const username = await SecureStore.getItemAsync(USERNAME);
          const password = await SecureStore.getItemAsync(PASSWORD);
          handleLogin({
            biometric: true,
            inputUsername: username,
            inputPassword: password,
          });
        }
      } else {
        Alert.alert("Error", "You did not enable biometric login");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "You did not enable biometric login");
    }
  };

  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const value = await AsyncStorage.getItem("biometric");
        if (value === "true") {
          setBiometricAvailable(true);
          useBiometric();
        } else {
          setBiometricAvailable(false);
        }
      } catch (error) {}
    };
    checkBiometric();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Login" />

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
          onPress={() => handleLogin({ biometric: false })}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={styles.linkButton}
        >
          <Text style={styles.linkButtonText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>

        {biometricAvailable && (
          <TouchableOpacity
            onPress={() => {
              useBiometric();
            }}
            style={styles.linkButton}
          >
            <Text style={{ fontWeight: "bold" }}>Use Biometric</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
  linkButton: {
    marginTop: 15,
  },

  linkButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
