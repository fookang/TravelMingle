import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import PasswordCheckList from "../../components/PasswordCheckList";
import api from "../../../services/api";
import { useRouter } from "expo-router";

const changePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [errorSamePassword, setErrorSamePassword] = useState("");
  const router = useRouter();

  const handleChangePassword = async () => {
    try {
      setErrorMessage("");
      setErrorSamePassword("");

      const response = await api.post("user/change-password/", {
        old_password: password,
        new_password: newPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Your password has been reset successfully");
        router.back();
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.data["old_password"]) {
        const msg = err.response.data["old_password"];
        setErrorMessage(`${err.response.data["old_password"]}`);
      } else if (err.response?.data["non_field_errors"]) {
        setErrorSamePassword(`${err.response.data["non_field_errors"]}`);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Change Password" />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text>Current Password: </Text>
          <TextInput
            secureTextEntry
            value={password}
            placeholder=""
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <View style={styles.section}>
          <Text>New Password: </Text>
          <TextInput
            secureTextEntry
            value={newPassword}
            placeholder=""
            onChangeText={setNewPassword}
            style={styles.input}
          />
        </View>
        <View style={styles.section}>
          <Text>Confirm New Password: </Text>
          <TextInput
            secureTextEntry
            value={ConfirmNewPassword}
            placeholder=""
            onChangeText={setConfirmNewPassword}
            style={styles.input}
          />
        </View>
        <View style={{ marginBottom: 5 }}>
          <PasswordCheckList
            password={newPassword}
            confirmPassword={ConfirmNewPassword}
            checkValidation={setValid}
          />
        </View>
        {errorSamePassword && (
          <Text style={styles.errorMessage}>{errorSamePassword}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          disabled={!valid}
          onPress={() => {
            console.log("submit");
            handleChangePassword();
          }}
        >
          <Text style={{ color: "#fff" }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default changePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    padding: 10,
    borderColor: "#ccc",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    height: 50,
    borderRadius: 5,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    marginTop: -5,
  },
});
