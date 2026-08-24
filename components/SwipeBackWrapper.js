// src/components/SwipeBackWrapper.js
import React, { useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const EDGE_WIDTH = 30;        // how close to the left edge a swipe must start
const DISMISS_THRESHOLD = 0.28; // % of screen width to trigger a pop
const VELOCITY_THRESHOLD = 800; // fast flick also triggers a pop

export default function SwipeBackWrapper({ children, enabled = true }) {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;

  if (!enabled) return children;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const shouldGoBack =
        translationX > SCREEN_WIDTH * DISMISS_THRESHOLD ||
        velocityX > VELOCITY_THRESHOLD;

      if (shouldGoBack && navigation.canGoBack()) {
        Animated.timing(translateX, {
          toValue: SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          navigation.goBack();
          translateX.setValue(0);
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-20, 20]}
      hitSlop={{ left: 0, width: EDGE_WIDTH }} // only starts near left edge
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [0, SCREEN_WIDTH],
                  outputRange: [0, SCREEN_WIDTH],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}