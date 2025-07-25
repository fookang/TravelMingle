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

  return (
    <SafeAreaView>
      <Header title="Edit Itinerary" />
      <View>
        <Text>Title:</Text>
        <TextInput
          defaultValue={itinerary.title}
          value={newItinerary.title}
          onChangeText={(value) =>
            setNewItinerary((prev) => ({ ...prev, title: value }))
          }
        />
      </View>
      <View>
        <Text>Description:</Text>
        <TextInput
          defaultValue={itinerary.description || ""}
          value={newItinerary.description}
          onChangeText={(value) =>
            setNewItinerary((prev) => ({ ...prev, description: value }))
          }
        />
      </View>
      <View>
        <View>
          <TouchableOpacity
            onPress={() => buttonDispatch({ type: "toggleStart" })}
          >
            <Text>Start</Text>
            <View>
              <Text>
                {newItinerary.start_date
                  ? displayDate(newItinerary.start_date)
                  : displayDate(itinerary.start_date)}
              </Text>
              <Ionicons name="calendar-clear-outline" />
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

          <TouchableOpacity
            onPress={() => buttonDispatch({ type: "toggleEnd" })}
          >
            <Text>End</Text>
            <View>
              <Text>
                {newItinerary.end_date
                  ? displayDate(newItinerary.end_date)
                  : displayDate(itinerary.end_date)}
              </Text>
              <Ionicons name="calendar-clear-outline" />
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
        onPress={async () => {
          const formatted = formatItinerary(newItinerary);
          console.log(JSON.stringify(formatted));
          await updateItinerary(itinerary.id, formatted);
          router.back();
        }}
      >
        <Text>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ItineraryUpdate;

const styles = StyleSheet.create({});
