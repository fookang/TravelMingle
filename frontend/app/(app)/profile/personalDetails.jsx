import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useCallback, useState, useEffect } from "react";
import api from "../../../services/api";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";

const personalDetails = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const getPersonalDetail = async () => {
    try {
      const response = await api.get("user/");
      console.log(response.data);
      const {
        username,
        email,
        avatar,
        first_name: firstName,
        last_name: lastName,
      } = response.data;
      setUsername(username);
      setEmail(email);
      setAvatar(`${avatar}?t=${Date.now()}`);
      setFirstName(firstName);
      setLastName(lastName);
    } catch (err) {}
  };

  useFocusEffect(
    useCallback(() => {
      getPersonalDetail();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Personal Details" />
      <View style={styles.content}>
        <View style={styles.profile}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.name}>
            <Text style={styles.label}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.label && { color: "grey" }}>Username</Text>
          <Text style={styles.label}>{username}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.label && { color: "grey" }}>Email</Text>
          <Text style={styles.label}>{email}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "profile/editProfile",
              params: {
                username,
                email,
                avatar,
                firstName,
                lastName,
              },
            })
          }
        >
          <Text style={{ color: "#fff" }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default personalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profile: {
    alignItems: "center",
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 16,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#a8a8a8",
    backgroundColor: "#eee",
  },
  name: {
    flexDirection: "row",
  },
  label: {
    fontSize: 17,
  },
  detailsContainer: {
    paddingBottom: 15,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    height: 50,
    borderRadius: 5,
  },
});
