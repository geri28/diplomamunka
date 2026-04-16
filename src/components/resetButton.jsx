import { Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/HomeView.styles";

const ResetButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.deleteButton, style]} onPress={onPress}>
      <Text style={[styles.deleteButtonText, style]}>{title}</Text>
    </TouchableOpacity>
  );
};
export default ResetButton;
