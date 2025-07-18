import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../services/api";
import { formatDate } from "../../../constants/fomatDate";
import { useRouter } from "expo-router";

const ItineraryDetails = () => {
  const router = useRouter();
  const { id, title, start_date } = useLocalSearchParams();
  const [itinerary, setItinerary] = useState([]);

  const fetchItinerary = async () => {
    try {
      const response = await api.get(`itinerary/${id}/days/`);
      console.log(response);
      const sorted = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setItinerary(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  const getDayNumber = (date) => {
    const start = new Date(start_date);
    const current = new Date(date);
    const diff = Math.floor((current - start) / (1000 * 24 * 60 * 60) + 1);
    return diff;
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itineraryDay}
      onPress={() => {
        router.push({
          pathname: `/itineraries/${id}/days/${item.id}`,
          params: {
            title: item.title,
          },
        });
      }}
    >
      <Text style={styles.item}>
        Day {getDayNumber(item.date)}: {item.title}
      </Text>
      <Text style={styles.item}>{formatDate(item.date)}</Text>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      console.log("Focused: calling fetchItinerary");
      fetchItinerary();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} />

      {itinerary.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No days added yet.
        </Text>
      ) : (
        <View style={styles.content}>
          {itinerary.map((item) => renderItem(item))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ItineraryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  itineraryDay: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
