import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import api from "../../../../services/api";
import { useItinerary } from "../../../../context/ItineraryContext";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

const addDocument = () => {
  const { itinerary } = useItinerary();
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const DOC_TPYE = ["passport", "visa", "flight", "insurance"];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("doc_type", docType);

      if (file) {
        formData.append("file", {
          uri: file["uri"],
          name: file["name"],
          type: file["mimeType"],
        });
      }

      const response = await api.post(
        `itinerary/${itinerary.id}/documents/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        console.log(response.data);
        router.back();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickFile = async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({});
      if (response) setFile(response.assets[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.conatiner}>
      <Header title="Add Document" />
      <View style={styles.content}>
        <View style={styles.document}>
          <Text style={styles.documentLabel}>Document Type:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={docType}
              onValueChange={(item) => setDocType(item)}
            >
              <Picker.Item label="Select Document Type" value="" />
              {DOC_TPYE.map((type) => (
                <Picker.Item
                  key={type}
                  label={type.toUpperCase()}
                  value={type}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.fileSection}>
          <TouchableOpacity
            onPress={() => handlePickFile()}
            style={styles.chooseFileButton}
          >
            <Text style={styles.chooseFileButtonText}>Choose File</Text>
          </TouchableOpacity>
          <Text style={styles.fileName}>
            {file ? file["name"] : "No file selected"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default addDocument;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  document: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  documentLabel: {
    fontWeight: "500",
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: "#f1f4f7ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 35,
    justifyContent: "center",
  },
  fileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fileName: {
    color: "black",
    fontSize: 15,
  },
  chooseFileButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f1f4f7ff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
  },
  chooseFileButtonText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 15,
  },
  button: {
    marginTop: 24,
    width: "100%",
    backgroundColor: "#1866E3",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#1866E3",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A7B4C3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
