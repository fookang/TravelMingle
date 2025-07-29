import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../services/api";
import { formatDate, getDayNumber } from "../../../utils/Date";

import { useItinerary } from "../../../context/ItineraryContext";
import { itemStyle } from "../../../utils/styles/common";
import { useTheme } from "../../../context/ThemeContext";
import FloatingButton from "../../components/FloatingButton";

const ItineraryDetails = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
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

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={itemStyle(theme, { justifyContent: "space-between" })}
      onPress={() => {
        router.push({
          pathname: `/itineraries/${itinerary.id}/days/${item.id}`,
          params: {
            header_title: `Day ${getDayNumber(
              item.date,
              itinerary.start_date
            )}: ${item.title}`,
            title: item.title,
            date: item.date,
          },
        });
      }}
    >
      <View style={styles.label}>
        <Text style={styles.day}>
          Day {getDayNumber(item.date, itinerary.start_date)}
        </Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      fetchItinerary();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title={itinerary.title} />
        {itineraryDay.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No days added yet.
          </Text>
        ) : (
          <View style={styles.content}>
            {itineraryDay.map((item) => renderItem(item))}
          </View>
        )}
      </ScrollView>
      <FloatingButton
        url={{
          pathname: `/itineraries/${itinerary.id}/days/createDay`,
          params: {
            start_date: itinerary.start_date,
            end_date: itinerary.end_date,
          },
        }}
        style={{ bottom: 70 }}
      />
    </SafeAreaView>
  );
};

export default ItineraryDetails;

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
    },
    content: {
      paddingHorizontal: 20,
      marginTop: 20,
    },
    label: {
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      paddingVertical: 4,
      color: theme.textPrimary,
    },
    day: {
      fontWeight: "bold",
      fontSize: 16,
      width: "70",
    },
    date: {
      fontSize: 16,
      paddingVertical: 4,
      color: theme.textSecondary,
    },
  });
