import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";


const ItineraryDetails = () => {
  const router = useRouter();
  const { id, title, start_date, end_date } = useLocalSearchParams();
  const [itinerary, setItinerary] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} />

      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: `itineraries/${id}`,
              params: {
                id: id,
                title: title,
                start_date: start_date,
                end_date: end_date,
              },
            });
          }}
          style={styles.button}
        >
          <Text style={styles.text}>Itinerary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Finance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
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
