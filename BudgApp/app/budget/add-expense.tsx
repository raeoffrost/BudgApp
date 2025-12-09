import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddExpense() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

      <TextInput
        placeholder="Amount"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={note}
        onChangeText={setNote}
      />

      <Button title="Save" onPress={() => router.back()} />
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
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});
