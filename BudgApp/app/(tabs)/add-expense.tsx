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
import { Background } from "@react-navigation/elements";
import { globalStyles } from "../../src/styles/globalStyles";

export default function AddExpense() {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories)  || [];
  // const categories = useSelector((state: any) => state.categories.categories) as any[] || [];

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

    router.push("/transactions");
  };

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
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={[styles.input, { backgroundColor: colors.card}]}
        >
          <Picker.Item label="Select a category" value=""/>
          {categories.map((cat: any) => (
            <Picker.Item key={cat.id} label={`${cat.icon} ${cat.name}`} value={cat.name} />
          ))}
        </Picker>

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note"
          placeholderTextColor={colors.muted}
        />

        <PrimaryButton title="Save Expense" onPress={onSave} style={{ marginTop: spacing.md }} />
        <PrimaryButton title="Cancel" onPress={cancel} style={{ marginTop: spacing.md }} />
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
