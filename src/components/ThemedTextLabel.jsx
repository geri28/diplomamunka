import { Text } from "react-native";
import { styles } from "../styles/HomeView.styles.js";

const ThemedTextLabel = ({ style, ...props }) => {
  return <Text style={[styles.label, { paddingHorizontal: 10 }]} {...props} />;
};

export default ThemedTextLabel;
