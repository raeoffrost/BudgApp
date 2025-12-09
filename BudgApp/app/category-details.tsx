import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import Card from "../src/components/Card";
import Screen from "../src/components/Screen";
import {
  selectCategoryTotal,
  selectExpensesByCategory,
} from "../src/redux/expenseSelectors";
import { globalStyles } from "../src/styles/globalStyles";
import { colors, fontSizes, spacing } from "../src/theme/theme";

import { convert } from "../src/api/currency";

export default function CategoryDetails() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
  }>();

  // Get all expenses for this category
  const expenses = useSelector(selectExpensesByCategory(categoryId || ""));
  const totalSpent = useSelector(selectCategoryTotal(categoryId || ""));

  // CAD conversion state
  const [convertedCAD, setConvertedCAD] = useState<number | null>(null);

  useEffect(() => {
    async function convertCurrency() {
      const result = await convert(totalSpent, "USD", "CAD");
      setConvertedCAD(result);
    }
    convertCurrency();
  }, [totalSpent]);

  return (
    <Screen>
      <Card>
        {/* Title */}
        <Text style={globalStyles.title}>
          {categoryName || "Category Details"}
        </Text>

        {/* Category Info */}
        <Text style={styles.meta}>Category ID: {categoryId || "n/a"}</Text>

        {/* Total Spent */}
        <Text style={styles.amount}>Total Spent: ${totalSpent.toFixed(2)}</Text>

        {/* Converted Amount */}
        {convertedCAD !== null && (
          <Text style={styles.converted}>
            Total in CAD: ${convertedCAD.toFixed(2)}
          </Text>
        )}

        {/* Transactions Count */}
        <Text style={styles.subtitle}>
          Transactions • ({expenses.length})
        </Text>

        {/* List */}
        {expenses.length === 0 ? (
          <Text style={styles.empty}>No expenses in this category yet.</Text>
        ) : (
          expenses.map((item) => (
            <Text key={item.id} style={styles.item}>
              ${item.amount} — {item.note || "No note"}
            </Text>
          ))
        )}
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
    marginBottom: spacing.sm,
  },
  converted: {
    color: colors.accent,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  item: {
    color: colors.text,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  empty: {
    color: colors.muted,
    fontSize: fontSizes.sm,
  },
});
