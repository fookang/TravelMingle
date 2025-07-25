import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import api from "../../../services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatAsYYYYMMDD, displayDate } from "../../../constants/fomatDate";

const createItinerary = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());
  const [startDateButton, setStartDateButton] = useState(false);
  const [endDateButton, setEndDateButton] = useState(false);

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);

      const response = await api.post("itinerary/", {
        title,
        description,
        start_date: formatAsYYYYMMDD(start_date),
        end_date: formatAsYYYYMMDD(end_date),
      });
      if (response) {
        console.log(response.data);
        router.push("/home");
      } else {
        Alert.alert("Error", "An error occured. Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "An error occured. Please try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkValid = () => {
    if (start_date <= end_date) {
      setValid(true);
      return;
    }
    setValid(false);
  };

  useEffect(() => {
    checkValid();
  }, [start_date, end_date]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create new Itinerary" />
      <View style={styles.content}>
        <View style={styles.input}>
          <Text>
            Title: <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (showTitleError) setShowTitleError(false);
            }}
            style={styles.inputText}
          />
        </View>

        <View style={styles.input}>
          <Text>Description: </Text>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.inputText}
          />
        </View>

        <View>
          <TouchableOpacity onPress={() => setStartDateButton(true)}>
            <View style={styles.input}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.dateValue}>{displayDate(start_date)}</Text>
            </View>
          </TouchableOpacity>
          {startDateButton && (
            <DateTimePicker
              value={start_date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setStartDate(selectedDate);
                  setStartDateButton(false);
                }
              }}
            />
          )}
        </View>

        <View>
          <TouchableOpacity onPress={() => setEndDateButton(true)}>
            <View style={styles.input}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.dateValue}>{displayDate(end_date)}</Text>
            </View>
          </TouchableOpacity>

          {endDateButton && (
            <DateTimePicker
              value={end_date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setEndDate(selectedDate);
                  setEndDateButton(false);
                }
              }}
            />
          )}
        </View>

        {showTitleError && !title.trim() && (
          <Text style={styles.errorText}>Title is required.</Text>
        )}

        {!valid && (
          <Text style={styles.errorText}>
            Start date must be before or same as end date.
          </Text>
        )}

        <TouchableOpacity
          onPress={() => {
            if (!title.trim()) {
              setShowTitleError(true);
              return;
            }
            handleCreate();
          }}
          disabled={loading || !valid}
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

export default createItinerary;

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
  dateValue: {
    marginLeft: 8,
    color: "#333",
  },
  required: {
    color: "red",
  },
});
