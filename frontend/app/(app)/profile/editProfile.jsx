import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
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
      console.log("Avatar state updated:", avatar);
      console.log(typeof avatar);
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
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);

      if (
        avatar &&
        typeof avatar === "object" &&
        avatar.uri &&
        avatar.uri.startsWith("file")
      ) {
        formData.append("avatar", {
          uri: avatar.uri,
          name: avatar.fileName,
          type: avatar.mimeType,
        });
        console.log("Picture uploaded (object)");
      }

      const response = await api.patch("user/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        console.log(response.data);
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
        "Failed to update account. Please check your connection or try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Profile" />
      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage} style={{ alignItems: "center" }}>
          <Image
            source={{ uri: typeof avatar === "string" ? avatar : avatar?.uri }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>First Name: </Text>
          <TextInput
            value={firstName}
            placeholder=""
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Last Name: </Text>
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
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    marginHorizontal: 20,
    paddingTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#a8a8a8",
    backgroundColor: "#eee",
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#444",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    height: 50,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
});
