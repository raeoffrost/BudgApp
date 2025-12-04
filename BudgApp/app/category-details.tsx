import React from "react";
import { Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Screen from "../src/components/Screen";
import Card from "../src/components/Card";
import { colors, spacing, radius, fontSizes } from "../src/theme/theme";
import { globalStyles } from "../src/styles/globalStyles";

export default function CategoryDetails() {
  const { categoryId, categoryName, totalSpent } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
    totalSpent?: string;
  }>();

  const parsedTotal = totalSpent ? Number(totalSpent) : undefined;

  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>{categoryName || "Category details"}</Text>
        <Text style={styles.meta}>Category ID: {categoryId || "n/a"}</Text>
        {parsedTotal !== undefined && !Number.isNaN(parsedTotal) && (
          <Text style={styles.amount}>Spent: ${parsedTotal.toFixed(2)}</Text>
        )}
        <Text style={styles.todo}>TODO Davinder: Show full category breakdown, totals, and charts.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginBottom: spacing.sm,
  },
  amount: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  todo: {
    color: colors.muted,
    fontSize: fontSizes.xs,
  },
});
