import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import CustomDropdownItem from "../src/components/dropDownSelectItem.jsx";
import FloorMap from "../src/components/floorMap";
import GradientBackground from "../src/components/linearGradientBackground.jsx";
import MenuToggleButton from "../src/components/menuToggleButton";
import ResetButton from "../src/components/resetButton";
import ThemedTextLabel from "../src/components/ThemedTextLabel.jsx";
import { useHomeController } from "../src/controller/useHomeController.js";
import { floorNames } from "../src/controller/utils/constants.js";
import { styles } from "../src/styles/HomeView.styles.js";

const HomeView = () => {
  const {
    startOpen,
    setStartOpen,
    finishOpen,
    setFinishOpen,
    startValue,
    setStartValue,
    finishValue,
    setFinishValue,
    items,
    setItems,
    onStartOpen,
    onFinishOpen,
    onFloorOpen,
    floorOpen,
    setFloorOpen,
    floorValue,
    setFloorValue,
    floorItems,
    setFloorItems,
    handleMapLayout,
    handleReset,
    handleTouchStart,
    handleTouchEnd,
    path,
    liftOpen,
    setLiftOpen,
    liftValue,
    setLiftValue,
    liftItem,
    setLiftItem,
    onLift,
    floorsToRender,
    floorSwitch,
    isMenuOpen,
    toggleMenu,
    isAnimDone,
    menuMaxHeight,
    menuOpacity,
  } = useHomeController();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <MenuToggleButton isMenuOpen={isMenuOpen} onPress={toggleMenu} />
        <View style={styles.menu}>
          <Animated.View
            style={{
              maxHeight: menuMaxHeight,
              opacity: menuOpacity,
              overflow: isAnimDone ? "visible" : "hidden",
              zIndex: 1000,
            }}
          >
            <View style={styles.topBar}>
              <View style={[styles.dropdownContainer]}>
                <ThemedTextLabel>Honnan:</ThemedTextLabel>
                <DropDownPicker
                  open={startOpen}
                  value={startValue}
                  items={items}
                  setOpen={setStartOpen}
                  setValue={setStartValue}
                  setItems={setItems}
                  onOpen={onStartOpen}
                  placeholder="Válaszd ki melyik teremből indulj"
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  labelStyle={styles.dropdownLabel}
                  dropDownContainerStyle={[styles.dropdownBox]}
                  listMode="MODAL"
                  searchable={true}
                  modalContentContainerStyle={{
                    paddingTop:
                      Platform.OS === "android" ? StatusBar.currentHeight : 0,
                    backgroundColor: "#ffffff",
                  }}
                  modalProps={{
                    animationType: "slide",
                    presentationStyle: "formSheet",
                  }}
                  scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
                  autoScroll={true}
                  renderListItem={(props) => (
                    <CustomDropdownItem
                      {...props}
                      isUsedInOther={props.value === finishValue}
                    />
                  )}
                  searchPlaceholder="Válaszd ki melyik teremből indulj"
                />
              </View>
              <View style={[styles.dropdownContainer]}>
                <ThemedTextLabel>Hova:</ThemedTextLabel>
                <DropDownPicker
                  open={finishOpen}
                  value={finishValue}
                  items={items}
                  setOpen={setFinishOpen}
                  setValue={setFinishValue}
                  setItems={setItems}
                  onOpen={onFinishOpen}
                  placeholder="Válaszd ki melyik terembe érkezz"
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  labelStyle={styles.dropdownLabel}
                  dropDownContainerStyle={styles.dropdownBox}
                  scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
                  listMode="MODAL"
                  searchable={true}
                  modalContentContainerStyle={{
                    paddingTop:
                      Platform.OS === "android" ? StatusBar.currentHeight : 0,
                    backgroundColor: "#ffffff",
                  }}
                  modalProps={{
                    animationType: "slide",
                    presentationStyle: "formSheet",
                  }}
                  autoScroll={true}
                  renderListItem={(props) => (
                    <CustomDropdownItem
                      {...props}
                      isUsedInOther={props.value === startValue}
                    />
                  )}
                  searchPlaceholder="Válaszd ki melyik terembe érkezz"
                />
              </View>
            </View>

            <View style={styles.topBar}>
              <View style={[styles.dropdownContainer, { width: "60%" }]}>
                <ThemedTextLabel>Szint:</ThemedTextLabel>
                <DropDownPicker
                  open={floorOpen}
                  value={floorValue}
                  items={floorItems}
                  setOpen={setFloorOpen}
                  setValue={setFloorValue}
                  setItems={setFloorItems}
                  onOpen={onFloorOpen}
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  labelStyle={styles.dropdownLabel}
                  dropDownContainerStyle={styles.dropdownBox}
                  listMode="SCROLLVIEW"
                />
              </View>

              <View
                style={[
                  styles.dropdownContainer,
                  { width: "30%", margin: "auto", zIndex: 5000, elevation: 10 },
                ]}
              >
                <ThemedTextLabel>Liftel mész?</ThemedTextLabel>
                <DropDownPicker
                  open={liftOpen}
                  value={liftValue}
                  items={liftItem}
                  setOpen={setLiftOpen}
                  setValue={setLiftValue}
                  setItems={setLiftItem}
                  onOpen={onLift}
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  labelStyle={styles.dropdownLabel}
                  dropDownContainerStyle={styles.dropdownBox}
                  zIndex={5000}
                  zIndexInverse={1000}
                  ListMode="SCROLLVIEW"
                  autoScroll={true}
                />
              </View>
            </View>
            <View style={styles.deleteButtonBox}>
              <ResetButton
                title="Új útvonal tervezése (Törlés)"
                onPress={handleReset}
              />
            </View>
          </Animated.View>
        </View>

        <ScrollView style={{ flex: 1, zIndex: 1 }}>
          {floorsToRender.length > 0 ? (
            floorsToRender.map((floorKey) => (
              <FloorMap
                key={floorKey}
                floorKey={floorKey}
                floorName={floorNames[floorKey]}
                currentFloorData={floorSwitch[floorKey] || {}}
                path={path}
                startValue={startValue}
                finishValue={finishValue}
                handleMapLayout={handleMapLayout}
                handleTouchStart={handleTouchStart}
                handleTouchEnd={handleTouchEnd}
              />
            ))
          ) : (
            <Text style={styles.infoText}>
              Válassz egy szintet a térképhez!
            </Text>
          )}
        </ScrollView>
      </View>
    </GradientBackground>
  );
};

export default HomeView;
