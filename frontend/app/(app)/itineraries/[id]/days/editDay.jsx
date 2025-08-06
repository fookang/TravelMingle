import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../../../components/Header";
import DayForm from "./components/DayForm";
import api from "../../../../../services/api";

const editDay = () => {
  const { id, day_id, start_date, end_date, title, date } =
    useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEdit = async ({ title, date }) => {
    try {
      setLoading(true);
      const response = await api.patch(`itinerary/${id}/days/${day_id}/`, {
        title,
        date: date.toISOString().split("T")[0],
      });
      if (response) {
        router.back();
      } else {
        Alert.alert("Error", "An error occured. Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "An error occured. Please try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <Header title="Edit Day" />
      <DayForm
        handleAction={handleEdit}
        start_date={start_date}
        end_date={end_date}
        loading={loading}
        title={title}
        date={date}
      />
    </SafeAreaView>
  );
};

export default editDay;

const styles = StyleSheet.create({});
