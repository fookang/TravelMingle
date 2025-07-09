import { Stack } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
}
