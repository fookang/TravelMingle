import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import api from "../../../services/api";

const ItineraryDetails = () => {
  const { id, title } = useLocalSearchParams();

  const [itinerary, setItinerary] = useState();

  const fetchItinerary = async () => {
    try {
      const response = await api.get(`itinerary/${id}/days/`);
      console.log(response);
      setItinerary(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Focused: calling fetchItinerary");
      fetchItinerary();
    }, [])
  );

  return (
    <SafeAreaView>
      <Header title={title} />
      <Text>ItineraryDetails</Text>
    </SafeAreaView>
  );
};

export default ItineraryDetails;

const styles = StyleSheet.create({});
