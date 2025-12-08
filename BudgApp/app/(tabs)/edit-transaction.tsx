import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import { deleteExpense, updateExpense } from "../../src/redux/expenseReducer";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, spacing } from "../../src/theme/theme";

export default function EditTransaction() {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useLocalSearchParams();

  // --- Fix string | string[] error ---
  const transactionId = Array.isArray(params.transactionId)
    ? params.transactionId[0]
    : params.transactionId || "";

  const [description, setDescription] = useState(
    Array.isArray(params.initialDescription)
      ? params.initialDescription[0]
      : params.initialDescription || ""
  );

  const [amount, setAmount] = useState(
    Array.isArray(params.initialAmount)
      ? params.initialAmount[0]
      : params.initialAmount || ""
  );

  // --- Update Transaction ---
  const saveChanges = () => {
    if (!description || !amount) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    dispatch(
      updateExpense({
        id: transactionId,
        description,
        amount: Number(amount),
      })
    );

    router.replace("/transactions");
  };

  // --- Delete Transaction ---
  // const removeTransaction = () => {
  //   Alert.alert(
  //     "Delete Transaction",
  //     "Are you sure you want to remove this transaction?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: () => {
  //           dispatch(deleteExpense(transactionId));
  //           router.replace("/transactions");
  //         },
  //       },
  //     ]
  //   );
  // };

    const handleDelete = (id: number | string) => {
      dispatch(deleteExpense(id));
      router.replace("/transactions");    
    };

      const cancel = () => {
    router.push("/transactions");
  };

  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Edit Transaction</Text>

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
          keyboardType="numeric"
          onChangeText={setAmount}
        />

        <PrimaryButton title="Save Changes" onPress={saveChanges} />

        <PrimaryButton
          title="Delete Transaction"
          onPress={() => handleDelete(transactionId)}
          style={{ backgroundColor: colors.danger, marginTop: spacing.md }}
        />

        <PrimaryButton title="Come back to Transactions" onPress={cancel} style={{ marginTop: spacing.md, backgroundColor: colors.card }} />
      </Card>

    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.muted, // FIXED!
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: fontSizes.md,
    backgroundColor: colors.card,
  },
});
