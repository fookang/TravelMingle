import { Stack } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../../context/AuthContext";

export default function AppLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Stack screenOptions={{ headerShown: false }} />
      </ProtectedRoute>
    </AuthProvider>
  );
}
