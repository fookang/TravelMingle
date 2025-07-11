import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const PasswordCheckList = ({ password, confirmPassword, checkValidation }) => {
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isLongEnough = password.length >= 8;
  const passwordMatch = password === confirmPassword && password.length > 0;

  const isValid = hasLetter && hasNumber && isLongEnough && passwordMatch;

  useEffect(() => {
    checkValidation(isValid);
  }, [isValid, checkValidation]);

  return (
    <View>
      <View style={styles.container}>
        <Ionicons
          name={isLongEnough ? "checkmark-outline" : "close-outline"}
          style={isLongEnough ? styles.check : styles.notCheck}
        />
        <Text style={isLongEnough ? styles.check : styles.notCheck}>
          At least 8 characters
        </Text>
      </View>

      <View style={styles.container}>
        <Ionicons
          name={hasLetter ? "checkmark-outline" : "close-outline"}
          style={hasLetter ? styles.check : styles.notCheck}
        />
        <Text style={hasLetter ? styles.check : styles.notCheck}>
          Contain a letter
        </Text>
      </View>

      <View style={styles.container}>
        <Ionicons
          name={hasNumber ? "checkmark-outline" : "close-outline"}
          style={hasNumber ? styles.check : styles.notCheck}
        />
        <Text style={hasNumber ? styles.check : styles.notCheck}>
          Contain a number
        </Text>
      </View>

      <View style={styles.container}>
        <Ionicons
          name={passwordMatch ? "checkmark-outline" : "close-outline"}
          style={passwordMatch ? styles.check : styles.notCheck}
        />
        <Text style={passwordMatch ? styles.check : styles.notCheck}>
          Passwords match
        </Text>
      </View>
    </View>
  );
};

export default PasswordCheckList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  check: {
    color: "green",
    marginLeft: 5,
  },
  notCheck: {
    color: "red",
    marginLeft: 5,
  },
});
