import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Image, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { styles } from "../styles/HomeView.styles";

const FloorMap = ({
  floorKey,
  floorName,
  currentFloorData,
  path,
  startValue,
  finishValue,
  handleMapLayout,
  handleTouchStart,
  handleTouchEnd,
}) => {
  const currentFloorRooms = currentFloorData.rooms || {};
  const currentFloorAll = currentFloorData.allNodes || {};
  const currentImage = currentFloorData.image || null;

  return (
    <View style={styles.mapSection}>
      <Text style={styles.floorTitle}>{floorName}</Text>

      <View style={styles.mapAreaPlaceholder}>
        <ReactNativeZoomableView
          maxZoom={3}
          minZoom={1}
          zoomStep={2}
          initialZoom={1}
          bindToBorders={true}
        >
          <View
            style={styles.imageWrapper}
            onLayout={handleMapLayout}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(e, floorKey)}
          >
            {currentImage && (
              <Image
                source={currentImage}
                style={styles.mapImage}
                resizeMode="contain"
              />
            )}

            <Svg
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
              pointerEvents="none"
            >
              {path.length > 1 &&
                path.map((nodeKey, index) => {
                  if (index === path.length - 1) return null;
                  const current = currentFloorAll[path[index]];
                  const next = currentFloorAll[path[index + 1]];

                  if (!current || !next) return null;

                  return (
                    <Line
                      key={`line-${index}`}
                      x1={`${current.x}%`}
                      y1={`${current.y}%`}
                      x2={`${next.x}%`}
                      y2={`${next.y}%`}
                      stroke="#007bff"
                      strokeWidth="1.5"
                      strokeDasharray="2, 4"
                    />
                  );
                })}

              {Object.keys(currentFloorRooms).map((key) => {
                if (key !== startValue && key !== finishValue) return null;

                const node = currentFloorRooms[key];
                let dotColor = key === startValue ? "#00b84c" : "#007bff";
                let dotRadius = "1.5";

                return (
                  <Circle
                    key={key}
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={dotRadius}
                    fill={dotColor}
                    stroke="white"
                    strokeWidth="0.5"
                  />
                );
              })}
            </Svg>
          </View>
        </ReactNativeZoomableView>
      </View>
    </View>
  );
};

export default FloorMap;
