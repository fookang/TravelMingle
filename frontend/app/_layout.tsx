import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack.Screen name="(auth)" options={{ headerShown: false }} />;
}
