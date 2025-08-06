import { StyleSheet, Text, View, TextInput } from "react-native";

const Input = ({
  label,
  value,
  required = false,
  setValue,
  showError,
  setShowError,
  placeholder,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label}: {required ? <Text style={styles.required}>*</Text> : <></>}
      </Text>
      <TextInput
        placeholder={placeholder || label}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (showError) setShowError(false);
        }}
        style={[styles.inputText, showError && { borderColor: "red" }]}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
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
  required: {
    color: "red",
  },
});
