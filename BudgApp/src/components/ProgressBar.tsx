// src/components/ProgressBar.tsx
import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View } from "react-native";

export default function ProgressBar({ progress }: { progress: number }) {
  // Clamp between 0–100
  const pct = Math.min(Math.max(Number(progress) || 0, 0), 100);

  // Animated value starts at current pct
  const animatedWidth = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: pct,
      duration: 600,
      useNativeDriver: false, // width animation requires false
    }).start();
  }, [pct]);

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
    backgroundColor: "#4caf50", // green fill
  },
});