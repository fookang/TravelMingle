import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../../../../components/Header";
import api from "../../../../../../../services/api";

//#region Define state for useReducer for title
const titleInitial = { value: "", error: false };

function titleReducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, value: action.value, error: false };
    case "ERROR":
      return { ...state, error: true };
    default:
      return state;
  }
}
//#endregion

//#region Define state for useReducer for time
const timeInitial = { value: null, error: false, showPicker: false };

function timeReducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, value: action.value, error: false, showPicker: false };
    case "ERROR":
      return { ...state, error: true };
    case "SHOW_PICKER":
      return { ...state, showPicker: true };
    case "HIDE_PICKER":
      return { ...state, showPicker: false };
    default:
      return state;
  }
}
//#endregion

const createActivity = () => {
  const router = useRouter();
  const { id, day_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [title, dispatchTitle] = useReducer(titleReducer, titleInitial);
  const [time, dispatchTime] = useReducer(timeReducer, timeInitial);

  // Check if all required fields are inputted
  const checkValid = () => {
    let valid = true;
    if (!title.value) {
      dispatchTitle({ type: "ERROR" });
      valid = false;
    }
    if (!time.value) {
      dispatchTime({ type: "ERROR" });
      valid = false;
    }
    return valid;
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const formattedTime = time.value
        ? time.value.getHours().toString().padStart(2, "0") +
          ":" +
          time.value.getMinutes().toString().padStart(2, "0")
        : "";

      console.log(formattedTime);

      const response = await api.post(
        `itinerary/${id}/days/${day_id}/activities/`,
        {
          title: title.value,
          time: formattedTime,
        }
      );
      if (response) {
        router.back();
      } else {
        Alert.alert("Error", "An error occured. Please try again");
      }
    } catch (error) {
      if (error.response) {
        console.log("API error:", error.response.data);
        Alert.alert("Error", JSON.stringify(error.response.data));
      } else {
        Alert.alert("Error", "An error occurred. Please try again");
        console.log(error);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create new Activity" />
      <View style={styles.content}>
        <View style={styles.input}>
          <Text>
            Title: <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={(text) => {
              dispatchTitle({ type: "SET", value: text });
            }}
            style={styles.inputText}
          />
        </View>
        {title.error && !title.value.trim() && (
          <Text style={styles.errorText}>Title is required.</Text>
        )}

        <View>
          <TouchableOpacity
            onPress={() => dispatchTime({ type: "SHOW_PICKER" })}
          >
            <View style={styles.input}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.timeValue}>
                {time.value
                  ? `${time.value.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}`
                  : "Select Time"}
              </Text>
            </View>
          </TouchableOpacity>
          {time.showPicker && (
            <DateTimePicker
              value={time.value || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  dispatchTime({ type: "SET", value: selectedTime });
                } else {
                  dispatchTime({ type: "HIDE_PICKER" });
                }
              }}
            />
          )}

          {time.error && !time.value && (
            <Text style={styles.errorText}>Time is required.</Text>
          )}

          <TouchableOpacity
            onPress={() => {
              if (checkValid()) handleCreate();
            }}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Submitting" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default createActivity;

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
    marginBottom: 10,
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
  errorText: {
    color: "red",
    marginBottom: 10,
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
  label: {
    fontWeight: "500",
  },
  timeValue: {
    marginLeft: 8,
    color: "#333",
  },
  required: {
    color: "red",
  },
});
