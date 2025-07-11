import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";

const changePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("")
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("")
  return (
    <SafeAreaView>
      <Header title="Change Password" />
      <View>
        <View>
          <Text>Current Password: </Text>
          <TextInput
            secureTextEntry
            value={password}
            placeholder="Enter Current Password"
            onChangeText={setPassword}
          />
        </View>
        <View>
          <Text>New Password: </Text>
          <TextInput
            secureTextEntry
            value={newPassword}
            placeholder="Enter New Password"
            onChangeText={setNewPassword}
          />
        </View>
        <View>
          <Text>Confirm New Password: </Text>
          <TextInput
            secureTextEntry
            value={ConfirmNewPassword}
            placeholder="Confirm New Password"
            onChangeText={setConfirmNewPassword}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default changePassword;

const styles = StyleSheet.create({});
