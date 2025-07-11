import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useRouter } from "expo-router";

const passwordAndSecurity = () => {
    const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Password & Security" />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/profile/changePassword")}
        >
          <Text style={styles.text}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Two-Factor Authentication")}
        >
          <Text style={styles.text}>Two-Factor Authentication</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Biometric Login")}
        >
          <Text style={styles.text}>Biometric Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default passwordAndSecurity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 16,
  },
});
