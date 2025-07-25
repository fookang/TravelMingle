import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import api from "../../../../../services/api";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  formatDate,
  displayDate,
  parseYYYYMMDD,
} from "../../../../../constants/fomatDate";

const createDay = () => {
  const router = useRouter();
  const { id, start_date, end_date } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(parseYYYYMMDD(start_date));
  const [dateButton, setDateButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const response = await api.post(`itinerary/${id}/days/`, {
        title,
        date: date.toISOString().split("T")[0],
      });
      if (response) {
        router.back();
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create new Itinerary Day" />
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

        <View>
          <TouchableOpacity onPress={() => setDateButton(true)}>
            <View style={styles.input}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.dateValue}>
                {displayDate(date) || "Today"}
              </Text>
            </View>
          </TouchableOpacity>
          {dateButton && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              minimumDate={parseYYYYMMDD(start_date)}
              maximumDate={parseYYYYMMDD(end_date)}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                  setDateButton(false);
                }
              }}
            />
          )}
        </View>

        {showTitleError && !title.trim() && (
          <Text style={styles.errorText}>Title is required.</Text>
        )}

        <TouchableOpacity
          onPress={() => {
            if (!title.trim()) {
              setShowTitleError(true);
              return;
            }
            handleCreate();
          }}
          disabled={loading}
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

export default createDay;

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
