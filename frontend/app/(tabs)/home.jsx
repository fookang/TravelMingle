import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";
import { useCallback, useState } from "react";
import api from "../../services/api";

import { formatDate, formatAsYYYYMMDD } from "../../constants/fomatDate";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { itemStyle } from "../../utils/styles/common";
import FloatingButton from "../components/FloatingButton";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [currentItineraries, setCurrentItineraries] = useState([]);
  const [upcomingItineraries, setUpcomingItineraries] = useState([]);
  const [pastItineraries, setPastItineraries] = useState([]);
  const [displayPast, setDisplayPast] = useState(false);
  const [displayUpcoming, setDisplayUpcoming] = useState(false);

  const getItinerary = async () => {
    try {
      const response = await api.get("itinerary/");

      const today = formatAsYYYYMMDD(new Date());

      const current = [];
      const upcoming = [];
      const past = [];

      response.data.forEach((item) => {
        const start = item.start_date;
        const end = item.end_date;
        if (start <= today && end >= today) {
          current.push(item);
        } else if (start > today) {
          upcoming.push(item);
        } else if (end < today) {
          past.push(item);
        }
      });

      current.sort((a, b) => a.start_date.localeCompare(b.start_date));

      upcoming.sort((a, b) => a.start_date.localeCompare(b.start_date));

      past.sort((a, b) => a.start_date.localeCompare(b.start_date));

      setCurrentItineraries(current);
      setUpcomingItineraries(upcoming);
      setPastItineraries(past);
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={itemStyle(theme, { justifyContent: "space-between" })}
      onPress={() => {
        router.push({
          pathname: `itineraries/itinerary`,
          params: {
            id: item.id.toString(),
            title: item.title,
            start_date: item.start_date.toString(),
            end_date: item.end_date.toString(),
          },
        });
      }}
    >
      <Text style={styles.title}>{item.title}</Text>
      <View>
        <Text style={styles.dateItem}>{formatDate(item.start_date)}</Text>
        <Text style={styles.dateItem}>{formatDate(item.end_date)}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleDisplayPast = () => setDisplayPast(!displayPast);
  const toggleDisplayUpcoming = () => setDisplayUpcoming(!displayUpcoming);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) getItinerary();
    }, [isAuthenticated])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ProtectedRoute>
        <ScrollView
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingBottom: 70 }}
        >
          <View style={styles.header}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              Welcome back
            </Text>
          </View>

          <View style={styles.itineraryList}>
            {currentItineraries.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionContent}>Current</Text>
                </View>
                {currentItineraries.map((item) => renderItem(item))}
              </>
            )}

            {upcomingItineraries.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleDisplayUpcoming()}
                >
                  <Text style={styles.sectionContent}>Upcoming</Text>
                  <Ionicons
                    name={
                      displayUpcoming
                        ? "caret-up-outline"
                        : "caret-down-outline"
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
                    name={
                      displayPast ? "caret-up-outline" : "caret-down-outline"
                    }
                    style={styles.sectionContent}
                  />
                </TouchableOpacity>
                {displayPast && pastItineraries.map((item) => renderItem(item))}
              </>
            )}
          </View>
        </ScrollView>
        <FloatingButton url="/(app)/itineraries/createItinerary" />
      </ProtectedRoute>
    </SafeAreaView>
  );
};

export default Home;

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: theme.backgroundColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      paddingHorizontal: 10,
      alignItems: "center",
    },
    itineraryList: {
      marginTop: 10,
    },
    title: {
      fontSize: 16,
      paddingVertical: 4,
      color: theme.textPrimary,
    },
    dateItem: {
      fontSize: 16,
      paddingVertical: 4,
      color: theme.textSecondary,
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
      color: theme.textPrimary,
    },
  });
