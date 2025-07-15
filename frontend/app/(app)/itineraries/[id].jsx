import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useLocalSearchParams } from "expo-router";

const ItineraryDetails = () => {
  const { id, title } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <Header title={title} />
      <Text>ItineraryDetails</Text>
    </SafeAreaView>
  );
};

export default ItineraryDetails;

const styles = StyleSheet.create({});
