import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../../../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import ActivityList from "../../../../components/ActivityList";
import ShowToast from "../../../../components/ShowToast";

const ItineraryDayDetails = () => {
  const router = useRouter();
  const { title, day_id, id } = useLocalSearchParams();
  const [activity, setActivity] = useState([]);
  const [showNoLocation, setShowNoLocation] = useState(false);

  const showToast = () => {
    if (showNoLocation) return;
    setShowNoLocation(true);
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

  const handleEdit = ({ id, day_id, activity_id }) => {
    router.push({
      pathname: `/itineraries/${id}/days/${day_id}/activity/editActivity`,
      params: {
        activity_id,
      },
    });
  };

  const handleDelete = async ({ id, day_id, activity_id }) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.delete(
                `itinerary/${id}/days/${day_id}/activities/${activity_id}/`
              );
              fetchItineraryDay();
            } catch (error) {
              Alert.alert(
                "Error",
                "Could not delete activity. Please try again."
              );
              console.log(error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchItineraryDay();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
            {activity.map((item) => (
              <ActivityList
                item={item}
                key={item.id}
                showToast={showToast}
                handleEdit={() =>
                  handleEdit({ id, day_id, activity_id: item.id })
                }
                handleDelete={() =>
                  handleDelete({ id, day_id, activity_id: item.id })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
      {showNoLocation && (
        <ShowToast
          visible={showNoLocation}
          message={"No location found"}
          onHide={() => setShowNoLocation(false)}
        />
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
});
