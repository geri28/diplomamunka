// src/components/scheduleView.jsx
import { useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  days,
  themeColor,
  universityHours,
} from "../controller/utils/constants";
import { styles } from "../styles/HomeView.styles";

const HOUR_HEIGHT = 60;
const DAYS = Object.values(days);
const timeLabels = Array.from(
  { length: universityHours.end - universityHours.start + 1 },
  (_, i) => universityHours.start + i,
);

const ScheduleGrid = ({ scheduleData, onClassPress }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours - universityHours.start) * 60 + minutes;
  };

  return (
    <View style={[styles.container, { paddingHorizontal: 10 }]}>
      <Animated.ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
      >
        <View>
          <View style={styles.headerRow}>
            <Animated.View
              style={[
                styles.timeColumnHeader,
                {
                  transform: [{ translateX: scrollX }],
                  zIndex: 10,
                  backgroundColor: themeColor.defaultColor,
                },
              ]}
            />
            {DAYS.map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>
          <ScrollView style={styles.scrollArea}>
            <View style={styles.gridContainer}>
              <Animated.View
                style={[
                  styles.timeColumn,
                  {
                    transform: [{ translateX: scrollX }],
                  },
                ]}
              >
                {timeLabels.map((hour) => (
                  <View
                    key={`time-${hour}`}
                    style={[styles.timeLabelContainer, { height: HOUR_HEIGHT }]}
                  >
                    <Text style={styles.timeLabelText}>{`${hour}:00`}</Text>
                  </View>
                ))}
              </Animated.View>

              {DAYS.map((day) => {
                const dailyClasses = scheduleData.filter(
                  (item) => item.day === day,
                );

                return (
                  <View key={`col-${day}`} style={styles.dayColumn}>
                    {timeLabels.map((hour) => (
                      <View
                        key={`grid-${hour}`}
                        style={[styles.gridLine, { height: HOUR_HEIGHT }]}
                      />
                    ))}

                    {dailyClasses.map((cls) => {
                      const startMins = timeToMinutes(cls.start);
                      const durationMins = timeToMinutes(cls.end) - startMins;

                      return (
                        <TouchableOpacity
                          key={cls.id}
                          style={[
                            styles.classBlock,
                            {
                              backgroundColor: cls.color || "#ccc",
                              top: startMins,
                              height: durationMins,
                            },
                          ]}
                          onPress={() => onClassPress(cls)}
                        >
                          <Text style={styles.classTitle}>{cls.title}</Text>
                          <Text style={styles.classTime}>
                            {`${cls.start} - ${cls.end}`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ScheduleGrid;
