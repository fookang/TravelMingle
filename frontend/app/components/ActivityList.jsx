import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

const ActivityList = ({ item, showToast, handleEdit, handleDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0 });
  const iconRef = useRef();

  const displayTime = (timeStr) => {
    const [hh, mm, ss] = timeStr.split(":");
    return `${hh}:${mm}`;
  };

  const openMenu = () => {
    iconRef.current.measureInWindow((x, y, width, height) => {
      setMenuPosition({ top: y + height + 18 });
      setMenuVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
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
        ref={iconRef}
        onPress={openMenu}
        style={styles.iconButton}
      >
        <Ionicons name="ellipsis-vertical" style={styles.icon} />
      </TouchableOpacity>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenMenuId(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View
            style={[
              styles.menu,
              {
                top: menuPosition.top,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleEdit();
              }}
              style={styles.menuItem}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleDelete();
              }}
              style={styles.menuItem}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ActivityList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fafafa",
    paddingVertical: 16,
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
    paddingLeft: 16,
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
  iconButton: {
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
    width: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
