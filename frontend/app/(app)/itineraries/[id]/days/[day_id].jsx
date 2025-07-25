import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../../../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";

const ItineraryDayDetails = () => {
  const router = useRouter();
  const { title, day_id, id } = useLocalSearchParams();
  const [activity, setActivity] = useState([]);

  const displayTime = (timeStr) => {
    const [hh, mm, ss] = timeStr.split(":");
    return `${hh}:${mm}`;
  };

  const fetchItineraryDay = async () => {
    try {
      const response = await api.get(
        `itinerary/${id}/days/${day_id}/activities/`
      );
      console.log(response.data);
      const sorted = response.data.sort((a, b) => a.time.localeCompare(b.time));
      setActivity(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItineraryDay();
    }, [])
  );

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.item}
      onPress={() => console.log("Activity", item.id)}
    >
      <Text style={styles.time}>{displayTime(item.time)}</Text>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header title={title} />
        <TouchableOpacity
          onPress={() => {
            router.push(
              `/itineraries/${id}/days/${day_id}/activity/createActivity`
            );
          }}
          style={styles.button}
        >
          <Icon name="add" size={15} color="black" />
        </TouchableOpacity>
      </View>
      {activity.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No activity added yet.
        </Text>
      ) : (
        <View style={styles.content}>
          {activity.map((item) => renderItem(item))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ItineraryDayDetails;

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
    padding: 16,
  },
  item: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  time: {
    fontWeight: "bold",
    paddingRight: 20,
    fontSize: 15,
    width: 70,
  },
  title: {
    color: "#333",
    fontSize: 15,
  },
});
