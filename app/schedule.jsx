import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import GradientBackground from "../src/components/linearGradientBackground.jsx";
import ScheduleView from "../src/components/scheduleView";
import ThemedTextLabel from "../src/components/ThemedTextLabel.jsx";
import { useScheduleController } from "../src/controller/useScheduleController";
import { styles } from "../src/styles/HomeView.styles";

const ScheduleScreen = () => {
  const {
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
    isEditing,
    minTime,
    maxEndTime,
    maxStartTime,
  } = useScheduleController();
  return (
    <View style={{ flex: 1 }}>
      <ScheduleView scheduleData={schedule} onClassPress={openModalForEdit} />

      <TouchableOpacity style={styles.fab} onPress={openModalForAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <GradientBackground style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Óra szerkesztése" : "Új óra felvétele"}
            </Text>

            <TextInput
              placeholder="Tantárgy neve és a terem"
              placeholderTextColor="#888888"
              style={styles.input}
              value={newClass.title}
              onChangeText={(text) => setNewClass({ ...newClass, title: text })}
            />

            <DropDownPicker
              open={dayOpen}
              value={newClass.day}
              items={dayItems}
              setOpen={setDayOpen}
              onOpen={() => {
                Keyboard.dismiss();
              }}
              setItems={setDayItems}
              setValue={(callback) => {
                setNewClass((prev) => ({
                  ...prev,
                  day:
                    typeof callback === "function"
                      ? callback(prev.day)
                      : callback,
                }));
              }}
              placeholder="Válassz egy napot!"
              style={[styles.input]}
              dropDownContainerStyle={{}}
              textStyle={{ color: "#000000" }}
              zIndex={3000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
              listProps={{
                keyboardShouldPersistTaps: "handled",
              }}
            />

            <View style={styles.timeRow}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <ThemedTextLabel>Kezdés:</ThemedTextLabel>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.timeButtonText}>{newClass.start}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, marginLeft: 5 }}>
                <ThemedTextLabel>Befejezés:</ThemedTextLabel>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.timeButtonText}>{newClass.end}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveClass}>
              <Text style={styles.saveButtonText}>Mentés</Text>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                style={[styles.deleteButton, { width: "100%" }]}
                onPress={deleteClass}
              >
                <Text style={styles.deleteButtonText}>Törlés</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelText}>Mégse</Text>
            </TouchableOpacity>
          </GradientBackground>
        </View>
      </Modal>
      {showStartPicker && (
        <DateTimePicker
          value={createDateFromTime(newClass.start)}
          mode="time"
          is24Hour={true}
          display="clock"
          onChange={onStartTimeChange}
          minimumDate={minTime}
          maximumDate={maxStartTime}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={createDateFromTime(newClass.end)}
          mode="time"
          is24Hour={true}
          display="clock"
          onChange={onEndTimeChange}
          maximumDate={maxEndTime}
          textColor="#fee507"
        />
      )}
    </View>
  );
};

export default ScheduleScreen;
