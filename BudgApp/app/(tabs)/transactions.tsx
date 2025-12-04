import React from "react";
import { Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../src/components/Screen";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, spacing, fontSizes } from "../../src/theme/theme";

export default function Transactions() {
  const router = useRouter();

  const dummyTransaction = {
    id: "tx1",
    description: "Groceries",
    amount: 82.5,
  };

  const goToEdit = () => {
    router.push({
      pathname: "/edit-transaction",
      params: {
        transactionId: dummyTransaction.id,
        initialDescription: dummyTransaction.description,
        initialAmount: String(dummyTransaction.amount),
      },
    });
  };

  return (
    <Screen>
      <Card>
        <Text style={globalStyles.title}>Transactions</Text>
        <Text style={styles.todo}>
          TODO Iuliia: Replace this stub with a FlatList, connect to Redux, and show totals by month.
        </Text>

        <PrimaryButton title="Edit example transaction" onPress={goToEdit} style={{ marginTop: spacing.md }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  todo: {
    color: colors.muted,
    fontSize: fontSizes.sm,
  },
});
