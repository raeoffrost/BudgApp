import React from "react";
import { Text, StyleSheet } from "react-native";
import Screen from "../../src/components/Screen";
import Card from "../../src/components/Card";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes } from "../../src/theme/theme";

export default function Budget() {
  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Budget</Text>
        <Text style={styles.todo}>
          TODO Lisa: Build budget form, connect to Redux, and show remaining budget with currency options.
        </Text>
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
