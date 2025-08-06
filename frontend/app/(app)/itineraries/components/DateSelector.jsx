import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { displayDate } from "../../../../utils/Date";

const DateSelector = ({
  label,
  date,
  onPress,
  isOpen,
  onChange,
  minimumDate,
  maximumDate,
  style = {},
}) => {
  return (
    <View style={[styles.date, style]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.dateTitle}>{label}</Text>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{displayDate(date)}</Text>
          <Ionicons name="calendar-clear-outline" size={20} />
        </View>
        {isOpen && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            {...(minimumDate && { minimumDate })}
            {...(maximumDate && { maximumDate })}
            onChange={onChange}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
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
});
