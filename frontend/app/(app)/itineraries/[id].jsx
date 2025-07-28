import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../services/api";
import { formatDate } from "../../../constants/fomatDate";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useItinerary } from "../../../context/ItineraryContext";
import { itemStyle } from "../../../utils/styles/common";
import { useTheme } from "../../../context/ThemeContext";

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

  const getDayNumber = (date) => {
    const start = new Date(itinerary.start_date);
    const current = new Date(date);
    const diff = Math.floor((current - start) / (1000 * 24 * 60 * 60) + 1);
    return diff;
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={itemStyle(theme, { justifyContent: "space-between" })}
      onPress={() => {
        router.push({
          pathname: `/itineraries/${itinerary.id}/days/${item.id}`,
          params: {
            title: `Day ${getDayNumber(item.date)}: ${item.title}`,
          },
        });
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.day}>Day {getDayNumber(item.date)}</Text>
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
      <View style={styles.header}>
        <Header title={itinerary.title} />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: `/itineraries/${itinerary.id}/days/createDay`,
              params: {
                start_date: itinerary.start_date,
                end_date: itinerary.end_date,
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

const createStyles = (theme) =>
  StyleSheet.create({
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
    title: {
      fontSize: 16,
      paddingVertical: 4,
      color: theme.textPrimary,
    },
    day: {
      fontWeight: "bold",
      paddingRight: 20,
      fontSize: 16,
      width: "70",
    },
    date: {
      fontSize: 16, paddingVertical: 4, color: theme.textSecondary
    },
  });
