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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !password.trim() ||
      !validEmail ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError("Please fill in all required field");
      return;
    }

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailCheck.test(email)) {
      setError("Please enter a vlid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "user/register/",
        {
          first_name: firstName,
          last_name: lastName,
          username,
          password,
          email,
        },
        { timeout: 5000 }
      );

      if (response) {
        alert("Registration succesful! Please log in.");
        router.push("/login");
      }
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
      <Header title='register' />
      <View style={styles.content}>
        <View style={styles.name}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.nameInput}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.nameInput}
          />
        </View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering" : "Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80,
    paddingHorizontal: 20,
  },
  name: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  nameInput: {
    width: "48%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
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
