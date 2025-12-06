import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import Card from "../src/components/Card";
import PrimaryButton from "../src/components/PrimaryButton";
import Screen from "../src/components/Screen";
import { globalStyles } from "../src/styles/globalStyles";
import { colors, fontSizes, radius, spacing } from "../src/theme/theme";

import { useDispatch } from "react-redux";
import { updateExpense } from "../src/redux/expenseReducer";

export default function EditTransaction() {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useLocalSearchParams();

  const transactionId = Array.isArray(params.transactionId)
    ? params.transactionId[0]
    : params.transactionId || "";

  const initialDescription = Array.isArray(params.initialDescription)
    ? params.initialDescription[0]
    : params.initialDescription || "";

  const initialAmount = Array.isArray(params.initialAmount)
    ? params.initialAmount[0]
    : params.initialAmount || "";

  const initialCategory = Array.isArray(params.initialCategory)
    ? params.initialCategory[0]
    : params.initialCategory || "";

  const initialNote = Array.isArray(params.initialNote)
    ? params.initialNote[0]
    : params.initialNote || "";

  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount);

  const handleSave = () => {
    if (!transactionId) {
      Alert.alert("Missing ID", "Cannot save because ID is missing.");
      return;
    }

    if (!description || !amount) {
      Alert.alert("Missing Input", "Description and amount are required.");
      return;
    }

    dispatch(
      updateExpense({
        id: transactionId,
        description,
        amount: Number(amount),
        category: initialCategory, // keep original
        note: initialNote, // keep original
      })
    );

    Alert.alert("Success", "Transaction updated!");
    router.back();
  };

  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Edit Transaction</Text>
        <Text style={styles.meta}>ID: {transactionId}</Text>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: spacing.md }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginBottom: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.cardAlt,
    color: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
});
