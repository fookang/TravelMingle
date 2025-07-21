import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useCallback, useState } from "react";
import api from "../../services/api";
import { useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "../../constants/fomatDate";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const router = useRouter();
  const [upcomingItineraries, setUpcomingItineraries] = useState([]);
  const [pastItineraries, setPastItineraries] = useState([]);
  const [displayPast, setDisplayPast] = useState(false);
  const [displayUpcoming, setDisplayUpcoming] = useState(false);

  const getItinerary = async () => {
    try {
      const response = await api.get("itinerary/");

      const today = new Date();

      const upcoming = response.data
        .filter((item) => new Date(item.end_date) >= today.setHours(0, 0, 0, 0))
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

      const past = response.data
        .filter((item) => new Date(item.end_date) < today.setHours(0, 0, 0, 0))
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

      setUpcomingItineraries(upcoming);
      setPastItineraries(past);
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.content}
      onPress={() => {
        router.push({
          pathname: `itineraries/${item.id}`,
          params: {
            id: item.id.toString(),
            title: item.title,
            start_date: item.start_date.toString(),
            end_date: item.end_date.toString(),
          },
        });
      }}
    >
      <Text style={styles.item}>{item.title}</Text>
      <View>
        <Text style={styles.item}>{formatDate(item.start_date)}</Text>
        <Text style={styles.item}>{formatDate(item.end_date)}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleDisplayPast = () => setDisplayPast(!displayPast);
  const toggleDisplayUpcoming = () => setDisplayUpcoming(!displayUpcoming);

  useFocusEffect(
    useCallback(() => {
      getItinerary();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ProtectedRoute>
        <View style={styles.header}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Welcome back</Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/(app)/itineraries/createItinerary");
            }}
            style={styles.button}
          >
            <Icon name="add" size={15} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.itineraryList}>
          {upcomingItineraries.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleDisplayUpcoming()}
              >
                <Text style={styles.sectionContent}>Upcoming</Text>
                <Ionicons
                  name={
                    displayUpcoming ? "caret-up-outline" : "caret-down-outline"
                  }
                  style={styles.sectionContent}
                />
              </TouchableOpacity>
              {displayUpcoming &&
                upcomingItineraries.map((item) => renderItem(item))}
            </>
          )}
          {pastItineraries.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleDisplayPast()}
              >
                <Text style={styles.sectionContent}>Past</Text>
                <Ionicons
                  name={displayPast ? "caret-up-outline" : "caret-down-outline"}
                  style={styles.sectionContent}
                />
              </TouchableOpacity>
              {displayPast && pastItineraries.map((item) => renderItem(item))}
            </>
          )}
        </View>
      </ProtectedRoute>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#DDDDDD",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
  },
  content: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
  },
  itineraryList: {
    marginTop: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionContent: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
});
