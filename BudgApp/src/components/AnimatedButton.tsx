import React, { useRef } from "react";
import { Animated, Pressable, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors, spacing, radius, fontSizes } from "../theme/theme";

type AnimatedButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export default function AnimatedButton({ title, onPress, style, textStyle, disabled = false }: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          {
            opacity: disabled ? 0.5 : fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: colors.primary,
            borderRadius: radius.md,
            paddingVertical: spacing.sm,
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <Text
          style={[
            {
              color: colors.text,
              fontSize: fontSizes.md,
              fontWeight: "600",
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}