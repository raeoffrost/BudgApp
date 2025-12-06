import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function BudgetOverview() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Budget Overview</Text>

      <Text style={styles.subtitle}>Track your spending, goals, and categories.</Text>

      <Button
        title="Add Expense"
        onPress={() => router.push("/budget/add-expense")}
      />

      <Button
        title="View Categories"
        onPress={() => router.push("/budget/categories")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
  },
});
