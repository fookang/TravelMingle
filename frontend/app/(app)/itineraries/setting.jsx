import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import api from '../../../services/api'

const setting = () => {

  const getItineraryInfo = async () => {
    try {
      const response = await api.fetch('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView>
      <Header title="Itinerary settings" />
      <View>
        <Text></Text>
      </View>

    </SafeAreaView>
  );
};

export default setting;

const styles = StyleSheet.create({});
