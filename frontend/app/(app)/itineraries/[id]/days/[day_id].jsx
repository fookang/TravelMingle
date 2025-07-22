import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { useLocalSearchParams } from "expo-router";

const ItineraryDayDetails = () => {
  const { title } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <Header title={title} />
      <Text>ItineraryDayDetails</Text>
    </SafeAreaView>
  );
};

export default ItineraryDayDetails;

const styles = StyleSheet.create({});
