import React, { ReactNode } from "react";
import { ScrollView, StyleProp, ViewStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../theme/theme";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Screen({ children, scroll = false, centered = false, style }: ScreenProps) {
  const baseStyle = centered ? globalStyles.screenCentered : globalStyles.screen;

  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "right", "bottom", "left"]}>
        <ScrollView style={baseStyle} contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "right", "bottom", "left"]}>
      <View style={[baseStyle, style]}>{children}</View>
    </SafeAreaView>
  );
}
