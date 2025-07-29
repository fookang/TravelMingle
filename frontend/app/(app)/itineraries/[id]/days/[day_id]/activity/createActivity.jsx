import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../../../components/Header";
import api from "../../../../../../../services/api";
import ActivityForm from "../../../../../../components/ActivityForm";

const createActivity = () => {
  const router = useRouter();
  const { id, day_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleCreate = async ({
    title,
    time,
    location,
    address,
    locationName,
  }) => {
    try {
      setLoading(true);

      // Format time as "HH:mm"
      const formattedTime = time
        ? time.getHours().toString().padStart(2, "0") +
          ":" +
          time.getMinutes().toString().padStart(2, "0")
        : "";

      // Build payload with null fallback for optional fields
      const payload = {
        title: title.trim(),
        time: formattedTime,
        longitude: location?.longitude ?? null,
        latitude: location?.latitude ?? null,
        address: address?.trim() || null,
        location_name: locationName?.trim() || null,
      };

      const response = await api.post(
        `itinerary/${id}/days/${day_id}/activities/`,
        payload
      );
      if (response && response.status === 201) {
        router.back();
      } else {
        Alert.alert("Error", "An error occured. Please try again");
      }
    } catch (error) {
      if (error.response) {
        console.log("API error:", error.response.data);
        Alert.alert("Error", JSON.stringify(error.response.data));
      } else {
        Alert.alert("Error", "An error occurred. Please try again");
        console.log(error);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create new Activity" />
      <ActivityForm handleAction={handleCreate} loading={loading} />
    </SafeAreaView>
  );
};

export default createActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingTop: 16,
  },
});
