import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import { deleteExpense } from "../../src/redux/expenseReducer";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, spacing } from "../../src/theme/theme";

export default function Transactions() {
  const router = useRouter();
  const dispatch = useDispatch();

  // get all expenses from Redux
  const expenses = useSelector((state: any) => state.expenses);

  const handleDelete = (id: number | string) => {
    dispatch(deleteExpense(id));
  };

  const goToEdit = (item: any) => {
    router.push({
      pathname: "/edit-transaction",
      params: {
        transactionId: item.id.toString(),
        initialDescription: item.description || item.category,
        initialAmount: item.amount.toString(),
        initialCategory: item.category,
        initialNote: item.note,
      },
    });
  };

  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Transactions</Text>

        {expenses.length === 0 ? (
          <Text style={styles.empty}>No expenses yet. Add one!</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={styles.itemText}>
                  <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.note}>{item.note || "No note"}</Text>
                </View>

                <View style={styles.actions}>
                  <Pressable onPress={() => goToEdit(item)} style={styles.editBtn}>
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>

                  <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}

        <PrimaryButton
          title="Add New Expense"
          onPress={() => router.push("/add-expense")}
          style={{ marginTop: spacing.lg }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    marginTop: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardAlt,
  },
  itemText: {
    flex: 1,
  },
  amount: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
  category: {
    color: colors.text,
    fontSize: fontSizes.sm,
  },
  note: {
    color: colors.muted,
    fontSize: fontSizes.xs,
  },
  actions: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  editBtn: {
    padding: 4,
  },
  editText: {
    color: colors.info,
    fontSize: fontSizes.xs,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    color: colors.danger,
    fontSize: fontSizes.xs,
  },
});
