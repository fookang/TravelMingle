import { StyleSheet, Text, View, Button } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import ProtectedRoute from '../components/ProtectedRoute';

const Home = () => {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ProtectedRoute>
        <Text>Travel Mingle</Text>

        
      </ProtectedRoute>
    </SafeAreaView>
  );
}

export default Home

const styles = StyleSheet.create({})