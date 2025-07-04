import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import api from "../../services/api";

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
    setLoading(true);

    try {
      const response = await api.post("user/register/", {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        email,
      });

      if (response) {
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
    <View>
      <Text>Register</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
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
        title={loading ? "Registering" : "Register"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({});
