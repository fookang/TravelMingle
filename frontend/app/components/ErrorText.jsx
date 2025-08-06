import { StyleSheet, Text } from "react-native";
import React from "react";

const ErrorText = ({ display, text }) => {
  return display ? <Text style={styles.errorText}>{text}</Text> : <></>;
};

export default ErrorText;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
