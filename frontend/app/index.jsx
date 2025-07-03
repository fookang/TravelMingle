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
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="login" onPressIn={() => router.push("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({});
