import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useCallback, useState } from "react";
import api from "../../services/api";
import { useFocusEffect } from "expo-router";

const Home = () => {
  const router = useRouter();
  const [itineraries, setItineraries] = useState([]);
  const formatDate = (datestr) => {
    const date = new Date(datestr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const getItinerary = async () => {
    try {
      const response = await api.get("itinerary/");
      const sorted = response.data.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );
      console.log(response);
      setItineraries(sorted);
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getItinerary();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ProtectedRoute>
        <Text style={styles.header}>Welcome back</Text>

        <View style={styles.itineraryList}>
          {itineraries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.content}
              onPress={() => {
                router.push({
                  pathname: `/itineraries/[${item.id}]`,
                  params: {
                    id: item.id.toString(),
                    title: item.title,
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
          ))}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#dbd5d5ff",
    borderRadius: 8,
  },
  itineraryList: {
    marginTop: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
