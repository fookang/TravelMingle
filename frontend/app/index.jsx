import { Text, View, StyleSheet, Button } from "react-native";
import { Redirect, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <Redirect href="/(tabs)/home" />
  );
}

const styles = StyleSheet.create({});
