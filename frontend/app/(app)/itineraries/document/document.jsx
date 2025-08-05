import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import FloatingButton from "../../../components/FloatingButton";
import api from "../../../../services/api";
import { useEffect, useState } from "react";
import { useItinerary } from "../../../../context/ItineraryContext";
import * as FileSystem from "expo-file-system";

const document = () => {
  const { itinerary } = useItinerary();
  const [document, setDocument] = useState({});

  const groupData = (docs) => {
    const group = {};
    docs.forEach((doc) => {
      const firstName = doc.user.first_name;
      const lastName = doc.user.last_name;
      const name = `${firstName} ${lastName}`;
      if (!group[name]) {
        group[name] = [];
      }
      group[name].push(doc);
    });
    return group;
  };

  const getDocument = async () => {
    try {
      const response = await api.get(`itinerary/${itinerary.id}/documents/`);
      if (response.status === 200) {
        const sortedData = response.data.sort((a, b) =>
          a.user.username.localeCompare(b.user.username)
        );
        const group = groupData(sortedData);
        console.log(group);
        setDocument(group);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    getDocument();
  }, []);

  const renderItem = (item, name) => (
    <View key={item.id} style={styles.documentContainer}>
      <Text style={styles.docType}>{capitalizeFirst(item.doc_type)}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.file)}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>View File</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUser = ([name, docs]) => (
    <View key={name} style={styles.user}>
      <Text style={styles.userName}>{name}</Text>
      {docs.map((item) => renderItem(item, name))}
    </View>
  );

  // Not needed for now
  const handleDownload = async (fileUrl, fileName = "document") => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        FileSystem.documentDirectory + fileName
      );
      const { uri } = await downloadResumable.downloadAsync();
      console.log("Finished downloading to ", uri);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Doucment" />
        <View style={styles.content}>
          {Object.keys(document).length === 0 ? (
            <Text>No document added</Text>
          ) : (
            Object.entries(document).map(([name, docs]) =>
              renderUser([name, docs])
            )
          )}
        </View>
      </ScrollView>
      <FloatingButton
        url="itineraries/document/addDocument"
        style={{ bottom: 70 }}
      />
    </SafeAreaView>
  );
};

export default document;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  user: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  documentContainer: {
    backgroundColor: "#f2f4f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  docType: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  viewButton: {
    backgroundColor: "#2b2b2bff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
