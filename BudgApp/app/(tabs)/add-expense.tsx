import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import { addExpense } from "../../src/redux/expenseReducer";
import { colors, fontSizes, spacing } from "../../src/theme/theme";
import { useRouter } from "expo-router";
import { selectCategories } from "../../src/redux/categoryReducer";
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from "../../src/styles/globalStyles";

export default function AddExpense() {

  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories) || [];

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  // Validate and save expense
  const onSave = () => {

    // validate that amount or category is empty
    if (!amount.trim() || !category.trim()) {
      if (typeof window !== "undefined") {
        window.alert("Amount and category are required.");
      } else {
        Alert.alert("Missing Input", "Amount and category are required.");
      }
      return;
    }

    // validate that amount is positive number
    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      if (typeof window !== "undefined") {
        // Web: use browser confirm dialog
        window.alert("Please enter a valid positive number for the amount.");
      } else {
        // Mobile: use alert
        Alert.alert("Invalid Amount", "Please enter a valid positive number for the amount.");
      }
      return;
    }

    // save changes
    dispatch(
      addExpense({
        id: Date.now(),
        amount: Number(amount),
        category,
        note,
        description: note || category,
        date: new Date().toISOString(),
      })
    );

    // Alert - Success cnfirmation
    if (typeof window !== "undefined") {
      // Web: use browser confirm dialog
      window.alert("Success \n\n Expense added!");
    } else {
      // Mobile: use alert
      Alert.alert("Success", "Expense added!");
    }

    // Reset fields
    setAmount("");
    setCategory("");
    setNote("");

    router.push("/transactions");
  };


  // Cancel adding expense
  const cancel = () => {

    // Reset fields
    setAmount("");
    setCategory("");
    setNote("");

    router.push("/transactions");
  };

  
  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Add new Expense</Text>

        // Amount
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
          placeholder="Enter amount"
          placeholderTextColor={colors.muted}
        />
        
        // Category
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={[styles.input, { backgroundColor: colors.card }]}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((cat: any) => (
            <Picker.Item key={cat.id} label={`${cat.icon} ${cat.name}`} value={cat.name} />
          ))}
        </Picker>

        // Description
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note"
          placeholderTextColor={colors.muted}
        />
        
        // Save button
        <PrimaryButton title="Save Expense" onPress={onSave} style={{ marginTop: spacing.md }} />

        // Go to Transactions button
        <PrimaryButton title="Go Back to Transactions" onPress={cancel} style={{ marginTop: spacing.md, backgroundColor: colors.card }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
