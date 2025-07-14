import { Tabs } from "expo-router";
import { AuthProvider } from "../../context/AuthContext";
const TabsLayout = () => {
  return (
    <AuthProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </AuthProvider>
  );
};

export default TabsLayout;
