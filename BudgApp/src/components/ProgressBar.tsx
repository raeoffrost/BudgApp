// src/components/ProgressBar.tsx
import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View } from "react-native";

export default function ProgressBar({ progress }: { progress: number }) {
  // Clamp between 0–100 for width animation
  const clampedPct = Math.min(Math.max(Number(progress) || 0, 0), 100);

  // Animated value starts at 0
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedPct,
      duration: 600,
      useNativeDriver: false, // width animation requires false
    }).start();
  }, [clampedPct]);

  // Color logic: red if progress > 100%
  const barColor = progress > 100 ? "#f44336" : "#4caf50";

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 12,
    backgroundColor: "#e0e0e0", // light gray background
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  fill: {
    height: "100%",
  },
});