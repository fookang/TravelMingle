import { Button } from "@react-navigation/elements";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Travel Mingle</Text>
      <Button title="login" onPressIn={() => router.push("/login")} />
      <Button title="Register" onPressIn={() => router.push("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({});
