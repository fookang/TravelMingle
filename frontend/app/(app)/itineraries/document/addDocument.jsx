import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import api from "../../../../services/api";
import { useItinerary } from "../../../../context/ItineraryContext";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";

const addDocument = () => {
  const { itinerary } = useItinerary();
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);

  const DOC_TPYE = ["passport", "visa", "flight", "insurance"];

  const handleSubmit = async () => {
    try {
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
      }
    } catch (error) {
      console.log(error);
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
    <SafeAreaView>
      <Header title="Add Document" />
      <View>
        <Text>Document Type:</Text>
        <Picker
          selectedValue={docType}
          onValueChange={(item) => setDocType(item)}
        >
          <Picker.Item label="Select Document Type" value="" />
          {DOC_TPYE.map((type) => (
            <Picker.Item key={type} label={type.toUpperCase()} value={type} />
          ))}
        </Picker>
      </View>
      <View>
        <Text>{file ? file["name"] : "No file selected"}</Text>
        <TouchableOpacity onPress={() => handlePickFile()}>
          <Text>Choose File</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default addDocument;

const styles = StyleSheet.create({});
