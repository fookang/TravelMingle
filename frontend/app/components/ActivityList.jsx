import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

const ActivityList = ({ item, showToast }) => {
  const [showEdit, setShowEdit] = useState();

  const displayTime = (timeStr) => {
    const [hh, mm, ss] = timeStr.split(":");
    return `${hh}:${mm}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={() => {
          if (item.location_name) {
            const encoded = encodeURIComponent(item.location_name);
            const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
            Linking.openURL(url);
          } else if (item.address) {
            const encodedAddress = encodeURIComponent(item.address);
            const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            Linking.openURL(url);
          } else if (item.latitude && item.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
            Linking.openURL(url);
          } else {
            showToast();
          }
        }}
      >
        <Text style={styles.time}>{displayTime(item.time)}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowEdit(!showEdit)}
        style={styles.iconButton}
      >
        <Ionicons name="ellipsis-vertical" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default ActivityList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fafafa",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    flex: 1,
  },
  time: {
    fontWeight: "bold",
    paddingRight: 20,
    fontSize: 15,
    width: 70,
  },
  title: {
    color: "#333",
    fontSize: 15,
  },
  iconButton: {},
  icon: {
    fontSize: 15,
  },
});
