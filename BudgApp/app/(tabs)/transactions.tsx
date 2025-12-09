import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../src/components/Card";
import Screen from "../../src/components/Screen";
import { deleteExpense } from "../../src/redux/expenseReducer";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, spacing } from "../../src/theme/theme";
import { selectCategories } from "../../src/redux/categoryReducer";
import { selectTotal } from "../../src/redux/expenseSelectors";
import FadeInListItem from "../../src/components/FadeInListItem";
import AnimatedButton from "../../src/components/AnimatedButton";
import { Alert } from "react-native";
import { selectRate, selectCurrency } from "../../src/redux/APIreducer";

export default function Transactions() {

  const router = useRouter();
  const dispatch = useDispatch();

  // get data from Redux
  const expenses = useSelector((state: any) => state.expenses) || [];
  const categories = useSelector(selectCategories) || [];
  const rate = useSelector(selectRate);
  const currency = useSelector(selectCurrency);
  const expensesTotal = useSelector(selectTotal);

  // count expenses total in the selected currency
  const convertedTotal = expensesTotal * rate;


  // delete expense
  const handleDelete = (id: number | string) => {
    if (typeof window !== "undefined") {
      // Web: use browser confirm dialog
      const confirmed = window.confirm("Are you sure you want to delete this transaction?");
      if (confirmed) {
        dispatch(deleteExpense(String(id)));
      }
    } else {
      // Mobile: use alert
      Alert.alert(
        "Delete Transaction",
        "Are you sure you want to remove this transaction?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              dispatch(deleteExpense(String(id)));
            },
          },
        ]
      );
    }
  };


  // route to edit-transaction
  const goToEdit = (item: any) => {
    router.push({
      pathname: "/edit-transaction",
      params: { id: item.id.toString() },
    });
  };


  // get category icon for the item 
  const getCategoryIcon = (expenseItem: any) => {
    const categoryObj = categories.find((cat: any) => cat.name === expenseItem.category);
    return categoryObj ? categoryObj.icon : "❓";
  };


  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Transactions</Text>

        {expenses.length === 0 ? (
          <Text style={styles.empty}>No expenses yet. Add one!</Text>
        ) : (
          <>
            <FlatList
              data={expenses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (

                <FadeInListItem>
                  <Pressable onPress={() => goToEdit(item)}>
                    <View style={styles.itemRow}>
                      
                      // expense data
                      <View style={styles.itemText}>
                        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                        <Text style={styles.category}>{getCategoryIcon(item)}</Text>
                        <Text style={styles.note}>{item.note || "No note"}</Text>
                      </View>
                      
                      // Edit button
                      <View style={styles.actions}>
                        <Pressable onPress={() => goToEdit(item)} style={styles.editBtn}>
                          <Text style={styles.editText}>Edit</Text>
                        </Pressable>
                        
                        // Delete button
                        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                          <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                      </View>

                    </View>
                  </Pressable>
                </FadeInListItem>
              )}
            />
            // Total in the main currency
            <Text style={styles.totalText}>Total:  {expensesTotal.toFixed(2)} USD</Text>
            // Total in th eselected currency
            <Text style={styles.totalText}>Total: {convertedTotal.toFixed(2)} {currency}</Text>
          </>
        )}

        // Add button
        <AnimatedButton title="Add New Expense" onPress={() => router.push("/add-expense")} style={{ marginTop: spacing.lg }} />
        {/* <PrimaryButton title="Go to Budget" onPress={() => router.push("/budget")} style={{ marginTop: spacing.md, backgroundColor: colors.card }} /> */}
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
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    width: 90,
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
  category: {
    width: 40,
    color: colors.text,
    fontSize: fontSizes.sm,
  },
  note: {
    width: 150,
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
  totalText: {
    color: colors.text,
    fontSize: fontSizes.md,
    marginTop: 20,
  }
});
