import { StyleSheet, Text, Animated, useAnimatedValue } from "react-native";
import { useEffect } from "react";

const ShowToast = ({ visible, message, onHide }) => {
  const fadeAnim = useAnimatedValue(0);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(onHide);
    }
  }, [visible]);

  return (
    <Animated.View style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default ShowToast;

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#333",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 999,
    opacity: 0.7,
  },
  toastText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
