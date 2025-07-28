import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fabStyle } from "../../utils/styles/common";
import { useTheme } from "../../context/ThemeContext";

const FloatingButton = ({ url }) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(url);
      }}
      style={fabStyle(theme)}
    >
      <Icon name="add" size={15} color={theme.floatingButtonText} />
    </TouchableOpacity>
  );
};

export default FloatingButton;