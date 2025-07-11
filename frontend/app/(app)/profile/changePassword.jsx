import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";

const changePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("")
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("")

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
        <TouchableOpacity style={styles.button}>
          <Text style={{ color: "#fff" }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default changePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    paddingBottom: 20
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    padding: 10,
    borderColor: '#ccc'
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    height: 50,
    borderRadius: 5,
  },
});
