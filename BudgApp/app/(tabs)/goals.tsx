import React from "react";
import { Text, StyleSheet } from "react-native";
import Screen from "../../src/components/Screen";
import Card from "../../src/components/Card";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes } from "../../src/theme/theme";

export default function Goals() {
  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Goals</Text>
        <Text style={styles.todo}>TODO Lisa: Add goals list, modals, and progress bars tied to Redux.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  todo: {
    color: colors.muted,
    fontSize: fontSizes.sm,
  },
});
