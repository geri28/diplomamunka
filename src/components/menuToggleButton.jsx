import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { styles } from "../styles/HomeView.styles";

const MenuToggleButton = ({ isMenuOpen, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuToggleButton} onPress={onPress}>
      <View style={styles.arrowColumn}>
        {isMenuOpen ? (
          <>
            <Ionicons
              name="chevron-up"
              size={13}
              color="white"
              style={{ marginBottom: -8, marginTop: -8 }}
            />
            <Ionicons
              name="chevron-up"
              size={13}
              color="white"
              style={{ marginBottom: -8 }}
            />
            <Ionicons
              name="chevron-up"
              size={13}
              color="white"
              style={{ marginBottom: -8 }}
            />
          </>
        ) : (
          <>
            <Ionicons
              name="chevron-down"
              size={13}
              color="white"
              style={{ marginTop: -8, marginBottom: -5 }}
            />
            <Ionicons
              name="chevron-down"
              size={13}
              color="white"
              style={{ marginBottom: -5 }}
            />
            <Ionicons
              name="chevron-down"
              size={13}
              color="white"
              style={{ marginBottom: -5 }}
            />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuToggleButton;
