import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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
      const { username, email, avatar, firstName, lastName } = response.data;
      setUsername(username);
      setEmail(email);
      setAvatar(avatar);
      setFirstName(firstName);
      setLastName(lastName);
    } catch (err) {}
  };

  useEffect(() => {
    getPersonalDetail();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Personal Details" />
      <View style={styles.content}>
        <View style={styles.profile}>
          <Image source={{ uri: avatar }} style={{ width: 100, height: 100 }} />
          <View style={styles.name}>
            <Text>{firstName}</Text>
            <Text>&nbsp;</Text>
            <Text>{lastName}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={{ color: "grey" }}>Username</Text>
          <Text>{username}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={{ color: "grey" }}>Email</Text>
          <Text>{email}</Text>
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
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profile: {
    alignItems: "center",
    paddingBottom: 20,
  },
  name: {
    flexDirection: "row",
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
