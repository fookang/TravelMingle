import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import FloatingButton from "../../../components/FloatingButton";

const document = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Doucment" />
        <Text>document</Text>
      </ScrollView>
      <FloatingButton
        url="itineraries/document/addDocument"
        style={{ bottom: 70 }}
      />
    </SafeAreaView>
  );
};

export default document;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
