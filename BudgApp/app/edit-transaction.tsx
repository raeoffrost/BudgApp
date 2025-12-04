import React, { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Screen from "../src/components/Screen";
import Card from "../src/components/Card";
import PrimaryButton from "../src/components/PrimaryButton";
import { colors, spacing, radius, fontSizes } from "../src/theme/theme";
import { globalStyles } from "../src/styles/globalStyles";

export default function EditTransaction() {
  const router = useRouter();
  const { transactionId, initialDescription, initialAmount } = useLocalSearchParams<{
    transactionId?: string;
    initialDescription?: string;
    initialAmount?: string;
  }>();

  const [description, setDescription] = useState(initialDescription || "");
  const [amount, setAmount] = useState(initialAmount || "");

  const handleSave = () => {
    router.back();
  };

  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Edit transaction</Text>
        <Text style={styles.meta}>ID: {transactionId || "n/a"}</Text>

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Amount</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />

        <Text style={styles.todo}>TODO Iuliia: Connect to Redux add/edit actions and form validation.</Text>

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
  todo: {
    color: colors.muted,
    fontSize: fontSizes.xs,
  },
});
