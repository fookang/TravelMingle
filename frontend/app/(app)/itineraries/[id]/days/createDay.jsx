import { Alert, StyleSheet } from "react-native";
import api from "../../../../../services/api";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/Header";

import DayForm from "../../../../components/DayForm";

const createDay = () => {
  const router = useRouter();
  const { id, start_date, end_date } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleCreate = async ({ title, date }) => {
    try {
      setLoading(true);
      const response = await api.post(`itinerary/${id}/days/`, {
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
    <SafeAreaView style={styles.container}>
      <Header title="Create new Itinerary Day" />
      <DayForm
        handleAction={handleCreate}
        start_date={start_date}
        end_date={end_date}
        loading={loading}
        title=""
        date={undefined}
      />
    </SafeAreaView>
  );
};

export default createDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
