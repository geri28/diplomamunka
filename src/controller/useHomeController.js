import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import {
  elsoEmeletAll,
  emelet1,
  emelet2,
  emelet3,
  emelet4,
  foldszint,
  foldszintAll,
  getFloorConfig,
  harmadikEmeletAll,
  masodikEmeletAll,
  negyedikEmeletAll,
} from "../model/mapData";
import { getFloors, getLift, getSortedRooms } from "../model/models";
import { calculateRoute } from "./utils/pathFinder";
import { resolveAliasNode } from "./utils/resolveAliasNode";

export const useHomeController = () => {
  const [floorOpen, setFloorOpen] = useState(false);
  const [floorValue, setFloorValue] = useState("foldszint");
  const [floorItems, setFloorItems] = useState(getFloors());

  const [startOpen, setStartOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);

  const [startValue, setStartValue] = useState(null);
  const [finishValue, setFinishValue] = useState(null);

  const [liftOpen, setLiftOpen] = useState(false);
  const [liftValue, setLiftValue] = useState("nem");
  const [liftItem, setLiftItem] = useState(getLift());

  const [mapDim, setMapDim] = useState({ width: 1, height: 1 });

  const [path, setPath] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAnimDone, setIsAnimDone] = useState(true);

  const prevStart = useRef(null);
  const prevFinish = useRef(null);
  const lastTap = useRef(0);
  const tapTimeout = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const menuAnim = useRef(new Animated.Value(500)).current;
  const toggleMenu = useCallback(() => {
    const willOpen = !isMenuOpen;

    setIsMenuOpen(willOpen);

    if (!willOpen) {
      setIsAnimDone(false);
    }

    Animated.timing(menuAnim, {
      toValue: willOpen ? 500 : 0,
      duration: 1200,
      useNativeDriver: false,
    }).start(() => {
      if (willOpen) {
        setIsAnimDone(true);
      }
    });
  }, [isMenuOpen, menuAnim]);

  const getFloorByNode = (nodeId) => {
    if (foldszintAll[nodeId]) return "foldszint";
    if (elsoEmeletAll[nodeId]) return "emelet1";
    if (masodikEmeletAll[nodeId]) return "emelet2";
    if (harmadikEmeletAll[nodeId]) return "emelet3";
    if (negyedikEmeletAll[nodeId]) return "emelet4";
    return null;
  };
  const startFloor = startValue ? getFloorByNode(startValue) : null;
  const finishFloor = finishValue ? getFloorByNode(finishValue) : null;

  const handleTouchStart = useCallback((e) => {
    const { pageX, pageY } = e.nativeEvent;
    touchStartPos.current = { x: pageX, y: pageY };
  }, []);

  const handleMapLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDim({ width, height });
  }, []);
  const handleTouchEnd = useCallback(
    (e, touchedFloorKey) => {
      const { pageX, pageY, locationX, locationY } = e.nativeEvent;

      const dx = pageX - touchStartPos.current.x;
      const dy = pageY - touchStartPos.current.y;
      const fingerTravelDistance = Math.sqrt(dx * dx + dy * dy);

      if (fingerTravelDistance > 15) return;

      const now = Date.now();
      const DOUBLE_TAP_DELAY = 200;

      if (now - lastTap.current < DOUBLE_TAP_DELAY) {
        if (tapTimeout.current) {
          clearTimeout(tapTimeout.current);
          tapTimeout.current = null;
        }
        lastTap.current = now;
        return;
      }
      lastTap.current = now;
      tapTimeout.current = setTimeout(() => {
        if (!mapDim || mapDim.width === 0) return;

        const clickedX = (locationX / mapDim.width) * 100;
        const clickedY = (locationY / mapDim.height) * 100;

        const effectiveFloor = touchedFloorKey || floorValue;

        const floorRoomsConfig = {
          foldszint: foldszint,
          emelet1: emelet1,
          emelet2: emelet2,
          emelet3: emelet3,
          emelet4: emelet4,
        };

        const currentMapData = floorRoomsConfig[effectiveFloor] || {};
        let closestNode = null;
        let minDistance = Infinity;

        Object.keys(currentMapData).forEach((key) => {
          const node = currentMapData[key];
          const dist = Math.sqrt(
            Math.pow(node.x - clickedX, 2) + Math.pow(node.y - clickedY, 2),
          );
          if (dist < minDistance) {
            minDistance = dist;
            closestNode = key;
          }
        });

        if (minDistance < 4 && closestNode) {
          const finalNode = resolveAliasNode(closestNode);
          if (!startValue) {
            setStartValue(finalNode);
          } else if (!finishValue && startValue !== finalNode) {
            setFinishValue(finalNode);
          }
        }
      }, DOUBLE_TAP_DELAY);
    },

    [mapDim, floorValue, startValue, finishValue],
  );

  const handleReset = useCallback(() => {
    setStartValue(null);
    setFinishValue(null);
    setPath([]);
  }, []);

  const [items, setItems] = useState(getSortedRooms());

  let floorsToRender = [];
  let displayStartFloor = startFloor;
  let displayFinishFloor = finishFloor;
  if (
    startValue === "audmax" &&
    (finishFloor !== "emelet3" || finishFloor === "emelet4")
  ) {
    displayStartFloor = "emelet3";
  } else if (
    finishValue === "audmax" &&
    (startFloor !== "emelet3" || startFloor === "emelet4")
  ) {
    displayFinishFloor = "emelet3";
  }
  if (
    startValue &&
    finishValue &&
    startValue !== finishValue &&
    path.length > 0
  ) {
    if (displayStartFloor) floorsToRender.push(displayStartFloor);
    if (displayFinishFloor && displayFinishFloor !== displayStartFloor)
      floorsToRender.push(displayFinishFloor);
  } else if (floorValue) {
    floorsToRender.push(floorValue);
  }
  const floorSwitch = getFloorConfig();

  useEffect(() => {
    if (startValue !== null && startValue === finishValue) {
      setFinishValue(prevStart.current);
    } else {
      setItems(getSortedRooms());
    }
    prevStart.current = startValue;
  }, [startValue]);

  useEffect(() => {
    if (finishValue !== null && finishValue === startValue) {
      setStartValue(prevFinish.current);
    } else {
      setItems(getSortedRooms());
    }
    prevFinish.current = finishValue;
  }, [finishValue]);

  useEffect(() => {
    const newPath = calculateRoute(
      startValue,
      finishValue,
      liftValue,
      startFloor,
      finishFloor,
    );
    setPath(newPath);
    if (
      newPath.length > 0 &&
      startFloor &&
      finishFloor &&
      startFloor !== finishFloor
    ) {
      setIsMenuOpen(false);
      setIsAnimDone(false);

      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    }
  }, [startValue, finishValue, liftValue, startFloor, finishFloor]);

  const onFloorOpen = useCallback(() => {
    setStartOpen(false);
    setFinishOpen(false);
  }, []);
  const onLift = useCallback(() => {
    setStartOpen(false);
    setFinishOpen(false);
  }, []);
  const onStartOpen = useCallback(() => {
    setFloorOpen(false);
    setFinishOpen(false);
  }, []);

  const onFinishOpen = useCallback(() => {
    setFloorOpen(false);
    setStartOpen(false);
  }, []);

  const menuMaxHeight = menuAnim.interpolate({
    inputRange: [0, 700],
    outputRange: [0, 700],
  });

  const menuOpacity = menuAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  });

  return {
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
  };
};
