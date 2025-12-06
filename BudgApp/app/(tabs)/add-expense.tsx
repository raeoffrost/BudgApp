import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import { addExpense } from "../../src/redux/expenseReducer";
import { colors, fontSizes, spacing } from "../../src/theme/theme";

export default function AddExpense() {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const onSave = () => {
    if (!amount.trim() || !category.trim()) {
      Alert.alert("Missing Input", "Amount and category are required.");
      return;
    }

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

    Alert.alert("Success", "Expense added!");

    // Reset fields
    setAmount("");
    setCategory("");
    setNote("");
  };

  return (
    <Screen>
      <Card>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
          placeholder="Enter amount"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Enter category"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note"
          placeholderTextColor={colors.muted}
        />

        <PrimaryButton title="Save Expense" onPress={onSave} style={{ marginTop: spacing.md }} />
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
