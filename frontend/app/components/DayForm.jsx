import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { parseYYYYMMDD, displayDate } from "../../constants/fomatDate";

const DayForm = ({
  handleAction,
  start_date,
  end_date,
  loading,
  title,
  date,
}) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDate, setDate] = useState(
    parseYYYYMMDD(date ? date : start_date)
  );
  const [dateButton, setDateButton] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  return (
    <View style={styles.content}>
      <View style={styles.input}>
        <Text>
          Title: <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Title"
          value={localTitle}
          onChangeText={(text) => {
            setLocalTitle(text);
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
              {displayDate(localDate) || "Today"}
            </Text>
          </View>
        </TouchableOpacity>
        {dateButton && (
          <DateTimePicker
            value={localDate}
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

      {showTitleError && !localTitle.trim() && (
        <Text style={styles.errorText}>Title is required.</Text>
      )}

      <TouchableOpacity
        onPress={() => {
          if (!localTitle.trim()) {
            setShowTitleError(true);
            return;
          }
          handleAction({ title: localTitle, date: localDate });
        }}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {loading
            ? title
              ? "Updating"
              : "Submitting"
            : title
            ? "Update"
            : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DayForm;

const styles = StyleSheet.create({
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
