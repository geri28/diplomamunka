import { Text, TouchableOpacity } from "react-native";

import { styles } from "../styles/HomeView.styles.js";

const CustomDropdownItem = (props) => {
  const isUsed = props.isUsedInOther;

  return (
    <TouchableOpacity
      onPress={() => props.onPress(props.item)}
      style={[
        styles.dropdownListItem,
        isUsed && styles.dropdownItemUsed,
        props.isSelected && styles.dropdownItemSelected,
      ]}
    >
      <Text
        style={[
          styles.dropdownListItemText,
          isUsed && styles.dropdownItemTextUsed,
          props.isSelected && styles.dropdownItemTextSelected,
        ]}
      >
        {props.label} {isUsed ? "(Ezt már megadtad értéknek)" : ""}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomDropdownItem;
