import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useItinerary } from "../../../context/ItineraryContext";
import { useReducer, useState } from "react";
import Header from "../../components/Header";
import {
  parseYYYYMMDD,
  displayDate,
  formatAsYYYYMMDD,
} from "../../../constants/fomatDate";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ButtonReducer = (buttonState, action) => {
  switch (action.type) {
    case "toggleStart":
      return { ...buttonState, startDateButton: !buttonState.startDateButton };

    case "toggleEnd":
      return { ...buttonState, endDateButton: !buttonState.endDateButton };

    default:
      return buttonState;
  }
};

const ItineraryUpdate = () => {
  const { itinerary, updateItinerary } = useItinerary();
  const [newItinerary, setNewItinerary] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTitleError, setShowTitleError] = useState("");
  const [buttonState, buttonDispatch] = useReducer(ButtonReducer, {
    startDateButton: false,
    endDateButton: false,
  });
  const router = useRouter();

  const formatItinerary = (itineraryObj) => ({
    ...itineraryObj,
    start_date: itineraryObj.start_date
      ? formatAsYYYYMMDD(itineraryObj.start_date)
      : undefined,
    end_date: itineraryObj.end_date
      ? formatAsYYYYMMDD(itineraryObj.end_date)
      : undefined,
  });

  const checkValid = (itineraryObj) => {
    if (itineraryObj.title === undefined) return true;
    if (itineraryObj.title.trim() === "") {
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (checkValid(newItinerary)) {
        const formatted = formatItinerary(newItinerary);
        console.log(JSON.stringify(formatted));
        await updateItinerary(itinerary.id, formatted);
        router.back();
      } else {
        setShowTitleError("Title cannot be empty");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Itinerary" />
      <View style={styles.content}>
        <View style={styles.input}>
          <Text style={styles.inputTitle}>Title:</Text>
          <TextInput
            defaultValue={itinerary.title}
            value={newItinerary.title}
            onChangeText={(value) => {
              setNewItinerary((prev) => ({ ...prev, title: value }));
              if (showTitleError && value.trim() !== "") setShowTitleError("");
            }}
            style={styles.inputText}
          />
        </View>

        {showTitleError && (
          <Text style={styles.errorText}>Title is required.</Text>
        )}

        <View style={styles.input}>
          <Text style={styles.inputTitle}>Description:</Text>
          <TextInput
            defaultValue={itinerary.description || ""}
            value={newItinerary.description}
            onChangeText={(value) => {
              setNewItinerary((prev) => ({ ...prev, description: value }));
            }}
            style={styles.inputText}
          />
        </View>
        <View style={styles.dateContainer}>
          <View style={styles.date}>
            <TouchableOpacity
              onPress={() => buttonDispatch({ type: "toggleStart" })}
            >
              <Text style={styles.dateTitle}>Start</Text>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>
                  {newItinerary.start_date
                    ? displayDate(newItinerary.start_date)
                    : displayDate(itinerary.start_date)}
                </Text>
                <Ionicons name="calendar-clear-outline" size={20} />
              </View>
              {buttonState.startDateButton && (
                <DateTimePicker
                  value={
                    newItinerary.start_date
                      ? newItinerary.start_date
                      : parseYYYYMMDD(itinerary.start_date)
                  }
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setNewItinerary((prev) => ({
                        ...prev,
                        start_date: selectedDate,
                      }));
                      buttonDispatch({ type: "toggleStart" });
                    }
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.date}>
            <TouchableOpacity
              onPress={() => buttonDispatch({ type: "toggleEnd" })}
            >
              <Text style={styles.dateTitle}>End</Text>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>
                  {newItinerary.end_date
                    ? displayDate(newItinerary.end_date)
                    : displayDate(itinerary.end_date)}
                </Text>
                <Ionicons name="calendar-clear-outline" size={20} />
              </View>
              {buttonState.endDateButton && (
                <DateTimePicker
                  value={
                    newItinerary.end_date
                      ? newItinerary.end_date
                      : parseYYYYMMDD(itinerary.end_date)
                  }
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setNewItinerary((prev) => ({
                        ...prev,
                        end_date: selectedDate,
                      }));
                      buttonDispatch({ type: "toggleEnd" });
                    }
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleUpdate()}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating" : "Update"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ItineraryUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  inputTitle: {
    fontSize: 15,
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dateContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 20,
  },
  date: {
    width: "50%",
    paddingRight: 20,
  },
  dateTitle: {
    color: "#383535ff",
    fontSize: 15,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#5e7791",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
