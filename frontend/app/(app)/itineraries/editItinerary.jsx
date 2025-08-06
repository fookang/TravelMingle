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
} from "../../../utils/Date";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateSelector from "./components/DateSelector";
import Input from "../../components/Input";
import ErrorText from "../../components/ErrorText";

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

  const checkTitle = (itineraryObj) => {
    if (itineraryObj.title === undefined) return true;
    if (itineraryObj.title.trim() === "") {
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (checkTitle(newItinerary)) {
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
        <Input
          label="Title"
          value={newItinerary.title}
          setValue={(value) =>
            setNewItinerary((prev) => ({ ...prev, title: value }))
          }
          required={true}
          showError={showTitleError}
          setShowError={setShowTitleError}
          defaultValue={itinerary.title}
        />

        <ErrorText text="Title is required." display={showTitleError} />

        <Input
          label="Description"
          value={newItinerary.description}
          setValue={(value) =>
            setNewItinerary((prev) => ({ ...prev, description: value }))
          }
          defaultValue={itinerary.description || ""}
        />

        <View style={styles.dateContainer}>
          <DateSelector
            label="Start"
            date={
              newItinerary.start_date
                ? newItinerary.start_date
                : parseYYYYMMDD(itinerary.start_date)
            }
            onPress={() => buttonDispatch({ type: "toggleStart" })}
            isOpen={buttonState.startDateButton}
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
          <DateSelector
            label="End"
            date={
              newItinerary.end_date
                ? newItinerary.end_date
                : parseYYYYMMDD(itinerary.end_date)
            }
            onPress={() => buttonDispatch({ type: "toggleEnd" })}
            isOpen={buttonState.endDateButton}
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
  dateContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 20,
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
