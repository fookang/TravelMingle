import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "../../../services/api";

const editProfile = () => {
  const params = useLocalSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (params.firstName) setFirstName(params.firstName);
    if (params.lastName) setLastName(params.lastName);
    if (params.username) setUsername(params.username);
    if (params.email) setEmail(params.email);
    if (params.avatar) setAvatar(params.avatar);
  }, []);

  useEffect(() => {
    if (avatar) {
      console.log("✅ Avatar state updated:", avatar);
    }
  }, [avatar]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    const { canceled } = result;
    if (!canceled) {
      setAvatar(result.assets[0]);
      console.log("ImagePicker result:", result);
      console.log(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);

      if (avatar && avatar.startsWith("file")) {
        formData.append("avatar", {
          uri: avatar.uri,
          name: avatar.fileName,
          type: avatar.mimeType,
        });
        console.log("Picture uploaded");
      }

      const response = await api.patch("user/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        Alert.alert("Success", "Your profile has been updated successfully", [
          { text: "Ok", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        "Failed to reset password. Please check your connection or try again."
      );
    }
  };

  return (
    <SafeAreaView>
      <Header title="Edit Profile" />
      <TouchableOpacity onPress={pickImage}>
        <Text>Select New Avatar</Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text>First Name: </Text>
        <TextInput
          value={firstName}
          placeholder=""
          onChangeText={setFirstName}
          style={styles.input}
        />
      </View>
      <View style={styles.section}>
        <Text>Last Name: </Text>
        <TextInput
          value={lastName}
          placeholder=""
          onChangeText={setLastName}
          style={styles.input}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        // disabled={!valid}
        onPress={() => {
          console.log("submit");
          handleUpdate();
        }}
      >
        <Text>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default editProfile;

const styles = StyleSheet.create({});
