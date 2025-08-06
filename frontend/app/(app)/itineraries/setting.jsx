import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useItinerary } from "../../../context/ItineraryContext";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "../../../utils/Date";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const setting = () => {
  const {
    itinerary,
    collaborators,
    fetchItineraryDetail,
    deleteItinerary,
    fetchCollaborator,
    AddCollaborator,
  } = useItinerary();
  const [inviteEmail, setInviteEmail] = useState("");
  const router = useRouter();

  if (!itinerary) return null;

  useEffect(() => {
    if (itinerary) fetchItineraryDetail(itinerary.id);
    fetchCollaborator(itinerary.id);
  }, []);

  const getDate = () => {
    const start = formatDate(itinerary.start_date).split(" ");
    const end = formatDate(itinerary.end_date).split(" ");
    if (start[2] !== end[2]) {
      return `${itinerary.start_date} - ${itinerary.end_date}`;
    }
    return `${start[0]} ${start[1]} - ${end[0]} ${end[1]}, ${start[2]}`;
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Itinerary",
      "Are you sure you want to delete this itinerary? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteItinerary(itinerary.id);
            router.replace("/home");
          },
        },
      ]
    );
  };

  const handleAddCollaborator = async () => {
    try {
      if (!inviteEmail) return;
      console.log(inviteEmail);
      await AddCollaborator(itinerary.id, { email: inviteEmail });
      setInviteEmail("");
    } catch (error) {
      Alert.alert("Error", "Could not add collaborator.");
    }
  };

  const renderCollaborators = (user) => (
    <View style={styles.members} key={user.user.id}>
      {user.user?.avatar ? (
        <Image source={{ uri: user.user.avatar }} style={styles.avatar} />
      ) : (
        <></>
      )}
      <View>
        <Text>
          {user.user ? `${user.user.first_name} ${user.user.last_name}` : ""}
        </Text>
        <Text>{user.user ? user.user.email : ""}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      <View style={styles.content}>
        <View style={styles.itineraryHeader}>
          <View>
            <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
            <Text style={styles.itineraryDate}>{getDate()}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/itineraries/editItinerary")}
          >
            <Icon name="edit" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Group members</Text>
          <View style={styles.addCollaboratorRow}>
            <TextInput
              placeholder="Enter email"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddCollaborator()}
            >
              <Text style={styles.addButtonText}>Invite</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.members}>
            {itinerary.user?.avatar ? (
              <Image
                source={{ uri: itinerary.user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <></>
            )}
            <View style={styles.owner}>
              <View>
                <Text>
                  {itinerary.user
                    ? `${itinerary.user.first_name} ${itinerary.user.last_name}`
                    : ""}
                </Text>
                <Text>{itinerary.user ? itinerary.user.email : ""}</Text>
              </View>
              <Text style={styles.ownerLabel}>Owner</Text>
            </View>
          </View>
          {collaborators ? (
            collaborators.map((user) => renderCollaborators(user))
          ) : (
            <></>
          )}
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.itineraryDelete}>
          <Ionicons name="trash-outline" color="red" style={styles.icon} />
          <Text style={styles.DeleteText}>Delete Itinerary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    marginHorizontal: 20,
    flexDirection: "column",
  },
  itineraryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingBottom: 14,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itineraryTitle: {
    color: "black",
    fontSize: 18,
  },
  itineraryDate: {
    color: "#555151ff",
    fontSize: 15,
  },
  itineraryDelete: {
    flexDirection: "row",
    fontSize: 18,
    alignItems: "center",
    paddingVertical: 20,
  },
  group: {
    marginBottom: 24,
    marginTop: 20,
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  addCollaboratorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  owner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownerLabel: {
    fontWeight: "bold",
    color: "#2e3135ff",
    marginRight: 10,
  },
  members: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
    fontSize: 25,
  },
  DeleteText: {
    fontSize: 18,
    color: "red",
  },
});
