import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../services/api";
import { formatDate } from "../../../constants/fomatDate";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useItinerary } from "../../../context/ItineraryContext";

const ItineraryDetails = () => {
  const router = useRouter();
  const { itinerary } = useItinerary();
  const [itineraryDay, setItineraryDay] = useState([]);

  const fetchItinerary = async () => {
    try {
      const response = await api.get(`itinerary/${itinerary.id}/days/`);
      console.log(response);
      const sorted = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setItineraryDay(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  const getDayNumber = (date) => {
    const start = new Date(itinerary.start_date);
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
          pathname: `/itineraries/${itinerary.id}/days/${item.id}`,
          params: {
            title: `Day ${getDayNumber(item.date)}: ${item.title}`,
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
      <View style={styles.header}>
        <Header title={itinerary.title} />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: `/itineraries/${id}/days/createDay`,
              params: {
                id: id,
                start_date: start_date,
                end_date: end_date,
              },
            });
          }}
          style={styles.button}
        >
          <Icon name="add" size={15} color="black" />
        </TouchableOpacity>
      </View>

      {itineraryDay.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No days added yet.
        </Text>
      ) : (
        <View style={styles.content}>
          {itineraryDay.map((item) => renderItem(item))}
        </View>
      )}
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
    justifyContent: "space-between",
    marginRight: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#DDDDDD",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
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
