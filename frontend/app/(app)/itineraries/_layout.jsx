import { Stack } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { ItineraryProvider } from "../../../context/ItineraryContext";

export default function AppLayout() {
  return (
    <ItineraryProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ItineraryProvider>
  );
}
