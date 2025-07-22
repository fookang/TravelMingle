import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { USERNAME, PASSWORD } from "../../../constants/tokens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/api";
import * as SecureStore from "expo-secure-store";
import { BlurView } from "expo-blur";

const passwordAndSecurity = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isEnabled, setIsEnabled] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");

  const verifyPassword = async () => {
    const username = await AsyncStorage.getItem("username");
    try {
      const response = await api.post(
        "user/token/",
        { username, password },
        { timeout: 5000 }
      );
      if (response.data) {
        await SecureStore.setItemAsync(USERNAME, username);
        await SecureStore.setItemAsync(PASSWORD, password);
        await AsyncStorage.setItem("biometric", "true");
        console.log("Successful");
        setModalVisible(false);
        setIsEnabled(true);
        setPassword("");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Invalid Password", error);
        setError("Invalid password, please try again.");
      } else {
        console.log(error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  const toggleBiometric = async () => {
    if (!isEnabled) {
      const supported = await checkBiometricSupport();
      if (!supported) {
        Alert.alert(
          "Error",
          "Biometric authentication is not available or set up on this device."
        );
        return;
      }
      setError("");
      setModalVisible(true);
    } else {
      await SecureStore.deleteItemAsync(USERNAME);
      await SecureStore.deleteItemAsync(PASSWORD);
      await AsyncStorage.removeItem("biometric");
      setIsEnabled(false);
    }
  };

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  };

  useEffect(() => {
    if (isEnabled) console.log("biometric Login");
  }, [isEnabled]);

  useEffect(() => {
    const checkBiometric = async () => {
      const value = await AsyncStorage.getItem("biometric");
      if (value === "true") {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    };
    checkBiometric();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView
            intensity={120}
            tint="light"
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalPassword}>
              <Text style={styles.modalText}>Password: </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={styles.modalInput}
                autoCapitalize="none"
              />
            </View>
            {error ? (
              <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
            ) : null}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={verifyPassword}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save & Enable</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setPassword("");
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Header title="Password & Security" />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/profile/changePassword")}
        >
          <Text style={styles.text}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => console.log("Two-Factor Authentication")}
        >
          <Text style={styles.text}>Two-Factor Authentication</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.text}>Biometric Login</Text>

          <Switch value={isEnabled} onValueChange={toggleBiometric} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default passwordAndSecurity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    marginHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: -80,
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
  },

  modalPassword: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  modalInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
  },
  modalText: {
    fontSize: 15,
    marginRight: 10,
  },
  modalButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    fontSize: 15,
    // letterSpacing: 0.2,
  },
});
