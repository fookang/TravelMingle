import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useItinerary } from "../../../context/ItineraryContext";
import { useEffect } from "react";

const ItineraryDetails = () => {
  const router = useRouter();
  const { setItinerary } = useItinerary();
  const { id, title, start_date, end_date } = useLocalSearchParams();

  useEffect(() => {
    setItinerary({
      id: id,
      title: title,
      start_date: start_date,
      end_date: end_date,
    });
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header title={title} />
        <TouchableOpacity onPress={() => router.push("/itineraries/setting")}>
          <Ionicons name="settings" style={{ fontSize: 24 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => {
            router.push(`itineraries/${id}`);
          }}
          style={styles.button}
        >
          <Text style={styles.text}>Itinerary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Finance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push(`itineraries/document/document`);
          }}
        >
          <Text style={styles.text}>Document</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ItineraryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    marginBottom: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
