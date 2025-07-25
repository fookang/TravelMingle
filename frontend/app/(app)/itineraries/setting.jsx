import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useItinerary } from "../../../context/ItineraryContext";
import { useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "../../../constants/fomatDate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const setting = () => {
  const { itinerary, setItinerary, fetchItineraryDetail, deleteItinerary } =
    useItinerary();
  const router = useRouter();

  if (!itinerary) return null;

  useEffect(() => {
    if (itinerary) fetchItineraryDetail(itinerary.id);
  }, []);

  const getDate = () => {
    const start = formatDate(itinerary.start_date).split(" ");
    const end = formatDate(itinerary.end_date).split(" ");
    console.log(start);
    console.log(end);
    if (start[2] !== end[2]) {
      return `${itinerary.start_date} - ${itinerary.end_date}`;
    }
    return `${start[0]} ${start[1]} - ${end[0]} ${end[1]}, ${start[2]}`;
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Itinerary",
      "Are you sure you want to delete this itinerary? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteItinerary(itinerary.id);
            router.replace("/home");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      <View style={styles.content}>
        <View style={styles.itineraryHeader}>
          <View>
            <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
            <Text style={styles.itineraryDate}>{getDate()}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/itineraries/editItinerary")}
          >
            <Icon name="edit" size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.itineraryDelete}>
          <Ionicons name="trash-outline" color="red" style={styles.icon} />
          <Text style={styles.DeleteText}>Delete Itinerary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    marginHorizontal: 20,
    flexDirection: "column",
  },
  itineraryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  itineraryTitle: {
    color: "black",
    fontSize: 18,
  },
  itineraryDate: {
    color: "#555151ff",
    fontSize: 15,
  },
  itineraryDelete: {
    flexDirection: "row",
    fontSize: 18,
    alignItems: "center",
    paddingVertical: 20,
  },
  icon: {
    marginRight: 10,
    fontSize: 25,
  },
  DeleteText: {
    fontSize: 18,
    color: "red",
  },
});
