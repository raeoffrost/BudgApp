import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { colors, spacing, radius } from "../theme/theme";

type CardProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number; // optional stagger
};

export default function Card({ children, style, delay = 0 }: CardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current; // start further down
  const scale = useRef(new Animated.Value(0.8)).current; // start smaller

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, scale, delay]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.lg,
          opacity,
          transform: [{ translateY }, { scale }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}