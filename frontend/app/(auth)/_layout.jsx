import { Stack } from "expo-router";
import { AuthProvider } from "../../context/AuthContext";

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
