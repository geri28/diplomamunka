import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { classColors, days, universityHours } from "./utils/constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "Órarend értesítések",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#fee507",
  });
}

export const useScheduleController = () => {
  const [schedule, setSchedule] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [dayItems, setDayItems] = useState(
    Object.values(days).map((dayName) => ({
      label: dayName,
      value: dayName,
    })),
  );

  const minTime = new Date();
  minTime.setHours(universityHours.start, 0, 0, 0);

  const maxStartTime = new Date();
  maxStartTime.setHours(universityHours.end - 2, 0, 0, 0);

  const maxEndTime = new Date();
  maxEndTime.setHours(universityHours.end, 0, 0, 0);

  const [editingId, setEditingId] = useState(null);
  const [newClass, setNewClass] = useState({
    title: "",
    day: "",
    start: "08:00",
    end: "10:00",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@my_schedule");
        if (storedData !== null) {
          setSchedule(JSON.parse(storedData));
        }
      } catch (e) {
        console.error("Hiba az adatok betöltésekor", e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Nem adtak engedélyt az értesítésekre!");
      }
    };
    requestPermissions();
  }, []);

  const scheduleClassNotification = async (classData) => {
    const dayMap = {
      Hétfő: 2,
      Kedd: 3,
      Szerda: 4,
      Csütörtök: 5,
      Péntek: 6,
    };
    const weekday = dayMap[classData.day];

    const [hours, minutes] = classData.start.split(":").map(Number);
    let triggerHour = hours - 1;
    let triggerMinute = minutes;

    if (triggerHour < 0) triggerHour += 24;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Óra kezdődik hamarosan!",
        body: `${classData.title} kezdődik 1 óra múlva (${classData.start}-kor). Ne felejts el elindulni!`,
        sound: true,
      },
      trigger: {
        weekday: weekday,
        hour: triggerHour,
        minute: triggerMinute,
        repeats: true,
      },
    });

    return notificationId;
  };

  const saveScheduleToDB = async (newSchedule) => {
    try {
      await AsyncStorage.setItem("@my_schedule", JSON.stringify(newSchedule));
    } catch (e) {
      console.error("Hiba a mentés során", e);
    }
  };

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const createDateFromTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const onStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const startMins =
        selectedDate.getHours() * 60 + selectedDate.getMinutes();
      if (startMins < 480 || startMins > 1200) {
        Alert.alert(
          "Hibás időpont!",
          "A kezdési időnek 08:00 és 20:00 között kell lennie!",
        );
        return;
      }
      const formattedTime = formatTime(selectedDate);
      const currentEndMins = timeToMinutes(newClass.end);

      let newEnd = newClass.end;

      if (startMins >= currentEndMins) {
        const newEndDate = new Date(selectedDate.getTime() + 120 * 60000);
        newEnd = formatTime(newEndDate);
      }

      setNewClass({ ...newClass, start: formattedTime, end: newEnd });
    }
  };

  const onEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const formattedTime = formatTime(selectedDate);
      const endMins = selectedDate.getHours() * 60 + selectedDate.getMinutes();
      const currentStartMins = timeToMinutes(newClass.start);

      if (endMins > 1320) {
        Alert.alert("Hibás időpont!", "A befejezési idő nem lehet 22:00 után!");
        return;
      }
      if (endMins <= currentStartMins) {
        Alert.alert(
          "Hibás időpont!",
          "A befejezés nem lehet korábban, mint a kezdés!",
        );
        return;
      }

      setNewClass({ ...newClass, end: formattedTime });
    }
  };

  const saveClass = async () => {
    if (newClass.title.trim() === "" && newClass.day.trim() === "") {
      Alert.alert(
        "Hiányzó adat!",
        "Kérlek, add meg a tantárgy nevét és a napot mentés előtt.",
      );
      return;
    } else if (newClass.title.trim() === "") {
      Alert.alert(
        "Hiányzó adat!",
        "Kérlek, add meg a tantárgy nevét mentés előtt.",
      );
      return;
    } else if (newClass.day.trim() === "") {
      Alert.alert(
        "Hiányzó adat!",
        "Kérlek, válassz ki egy napot a legördülő listából!",
      );
      return;
    }

    let updatedSchedule;
    let newNotificationId = null;

    try {
      newNotificationId = await scheduleClassNotification(newClass);
    } catch (error) {
      console.log("Nem sikerült ütemezni az értesítést", error);
    }

    if (editingId) {
      const oldClass = schedule.find((item) => item.id === editingId);
      if (oldClass && oldClass.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          oldClass.notificationId,
        );
      }
      updatedSchedule = schedule.map((item) =>
        item.id === editingId
          ? { ...newClass, id: editingId, notificationId: newNotificationId }
          : item,
      );
    } else {
      const classToAdd = {
        ...newClass,
        id: Date.now(),
        color: classColors[Math.floor(Math.random() * classColors.length)],
        notificationId: newNotificationId,
      };
      updatedSchedule = [...schedule, classToAdd];
    }

    setSchedule(updatedSchedule);
    saveScheduleToDB(updatedSchedule);
    closeModal();
  };

  const deleteClass = async () => {
    if (editingId) {
      const classToDelete = schedule.find((item) => item.id === editingId);
      if (classToDelete && classToDelete.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          classToDelete.notificationId,
        );
      }

      const updatedSchedule = schedule.filter((item) => item.id !== editingId);

      setSchedule(updatedSchedule);
      saveScheduleToDB(updatedSchedule);
      closeModal();
    }
  };

  const openModalForAdd = () => {
    setEditingId(null);
    setNewClass({ title: "", day: "", start: "08:00", end: "10:00" });
    setModalVisible(true);
  };

  const openModalForEdit = (classData) => {
    setEditingId(classData.id);
    setNewClass(classData);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
  };

  return {
    dayOpen,
    setDayOpen,
    dayItems,
    setDayItems,
    schedule,
    modalVisible,
    newClass,
    setNewClass,
    saveClass,
    deleteClass,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    onStartTimeChange,
    onEndTimeChange,
    createDateFromTime,
    isEditing: !!editingId,
    minTime,
    maxStartTime,
    maxEndTime,
  };
};
