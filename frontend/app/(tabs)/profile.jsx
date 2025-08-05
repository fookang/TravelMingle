import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAuth } from "../../context/AuthContext";

const profile = () => {
  const router = useRouter();

  const { logout, deleteUser } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ProtectedRoute>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile/personalDetails")}
            style={styles.button}
          >
            <Ionicons name="person-outline" style={styles.icons} />
            <Text style={styles.text}>Personal details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/profile/passwordAndSecurity")}
            style={styles.button}
          >
            <Ionicons name="lock-closed-outline" style={styles.icons} />
            <Text style={styles.text}>Password & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(app)/profile/paymentOption")}
            style={styles.button}
          >
            <Ionicons name="card-outline" style={styles.icons} />
            <Text style={styles.text}>Payment Option</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteUser()} style={styles.button}>
            <Ionicons name="trash-outline" style={styles.icons} />
            <Text style={styles.text}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => logout()} style={styles.button}>
            <Ionicons name="log-out-outline" style={styles.icons} />
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ProtectedRoute>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    flex: 1,
  },
  button: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icons: {
    fontSize: 20,
    marginRight: 12,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
