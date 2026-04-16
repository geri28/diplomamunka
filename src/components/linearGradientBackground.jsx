import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles/HomeView.styles.js";

const GRADIENT_COLORS = [
  "rgba(237, 237, 36, 0.65)",
  "rgba(17, 143, 0, 0.65)",
  "rgba(237, 237, 36, 0.65)",
  "rgba(17, 143, 0, 0.65)",
];

const GradientBackground = ({ style, children }) => {
  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientBackground, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
