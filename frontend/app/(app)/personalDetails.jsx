import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const personalDetails = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
    <SafeAreaView>
      <Header title="Personal Details" />
      <View>
        <View>
          <Image source={{uri: avatar}}/>
          <Text>{firstName}</Text>
          <Text>{lastName}</Text>
        </View>
        <Text>{username}</Text>
        <Text>{email}</Text>
      </View>
    </SafeAreaView>
  );
};

export default personalDetails;

const styles = StyleSheet.create({});
