import React from "react";
import { Pressable, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors, spacing, radius, fontSizes } from "../theme/theme";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, style, textStyle, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          paddingVertical: spacing.sm,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
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
    </Pressable>
  );
}
