import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useReducer, useEffect } from "react";
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
import MapView, { Marker } from "react-native-maps";
import GooglePlacesTextInput from "react-native-google-places-textinput";
import Constants from "expo-constants";

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

//#region Define state for useReducer for map

const mapInitial = {
  location: null,
  region: {
    latitude: 1.3521, // Singapore default
    longitude: 103.8198,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  locationName: "",
  address: "",
  error: false,
};

function mapReducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, location: action.value, error: false };

    case "SET_REGION":
      return { ...state, region: action.value };

    case "SET_LOCATION_NAME":
      return { ...state, locationName: action.value };

    case "SET_ADDRESS":
      return { ...state, address: action.value };

    case "ERROR":
      return { ...state, error: true };

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
  const [map, dispatchMap] = useReducer(mapReducer, mapInitial);
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAP_API_KEY;

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
        <View>
          <View style={styles.input}>
            <Text style={styles.label}>
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
        </View>

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
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.title}>Location: </Text>
          <GooglePlacesTextInput
            apiKey={GOOGLE_MAPS_API_KEY}
            fetchDetails={true}
            showLoadingIndicator={true}
            showClearButton={true}
            detailsFields={["formattedAddress", "location", "displayName"]}
            style={{
              container: {
                flex: 1,
              },
              input: {
                height: 44,
                borderWidth: 1,
                borderColor: "#E0E1E6",
                borderRadius: 10,
                backgroundColor: "#F7F7FB",
                marginLeft: 10,
                paddingHorizontal: 15,
                fontSize: 15,
                color: "#22223B",
              },
            }}
            onPlaceSelect={(place) => {
              console.log(place.details);
              dispatchMap({ value: place.details.location, type: "SET" });
              dispatchMap({
                value: place.details.displayName?.text || "",
                type: "SET_LOCATION_NAME",
              });
              dispatchMap({
                value: place.details.formattedAddress || "",
                type: "SET_ADDRESS",
              });
              dispatchMap({
                value: {
                  ...place.details.location,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                type: "SET_REGION",
              });
            }}
          />
        </View>

        {true && (
          <View style={{ height: 300, marginTop: 40, marginBottom: 30 }}>
            <MapView style={styles.map} region={map.region}>
              {map.location && <Marker coordinate={map.location} />}
            </MapView>
          </View>
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
    </SafeAreaView>
  );
};

export default createActivity;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//     backgroundColor: "#FAFAFC",
//   },
//   content: {
//     marginHorizontal: 20,
//     marginTop: 10,
//   },
//   input: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   inputText: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     marginLeft: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 10,
//   },
//   button: {
//     width: "100%",
//     backgroundColor: "#007bff",
//     padding: 12,
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   buttonDisabled: {
//     backgroundColor: "#5e7791",
//   },
//   buttonText: {
//     color: "black",
//     fontWeight: "bold",
//   },
//   label: {
//     fontWeight: "500",
//     fontSize: 17,
//   },
//   timeValue: {
//     marginLeft: 8,
//     color: "#333",
//   },
//   required: {
//     color: "red",
//   },
//   map: {
//     flex: 1,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingTop: 16,
  },
  content: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3142",
    paddingVertical: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3142",
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E1E6",
    borderRadius: 10,
    backgroundColor: "#F7F7FB",
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    color: "#22223B",
  },
  timeValue: {
    marginLeft: 8,
    fontSize: 15,
    color: "#495057",
  },
  required: {
    color: "#E63946",
    marginLeft: 2,
    fontWeight: "bold",
  },
  errorText: {
    color: "#E63946",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    marginTop: 24,
    width: "100%",
    backgroundColor: "#1866E3",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#1866E3",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A7B4C3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  map: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
});
