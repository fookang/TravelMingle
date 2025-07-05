import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Travel Mingle</Text>
      <Button title="login" onPress={() => router.push("/login")} />
      <Button title="Register" onPress={() => router.push("/register")} />
    </View>
  );
}

export default Home

const styles = StyleSheet.create({})