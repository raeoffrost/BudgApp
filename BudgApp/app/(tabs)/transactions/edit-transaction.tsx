import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import Card from "../../../src/components/Card";
import PrimaryButton from "../../../src/components/PrimaryButton";
import Screen from "../../../src/components/Screen";
import { deleteExpense, updateExpense } from "../../../src/redux/expenseReducer";
import { globalStyles } from "../../../src/styles/globalStyles";
import { colors, fontSizes, spacing } from "../../../src/theme/theme";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { selectCategories } from "../../../src/redux/categoryReducer";

export default function EditTransaction() {

  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories) || [];

  // get ID from the route
  const { id } = useLocalSearchParams();
  const transactionId = String(id);

  // get expense
  const transaction = useSelector((state: any) =>
    state.expenses.find((t: any) => String(t.id) === transactionId)
  );

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");


  // initial form
  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setDescription(transaction.note || "");
    }
  }, [transaction]);


  // Validate and save changes
  const saveChanges = () => {

    // validate that amount or category is empty
    if (!amount.trim() || !category.trim()) {
      if (typeof window !== "undefined") {
        // Web: use browser confirm dialog
        window.alert("Missing Input \n\n Amount and category are required.");
      } else {
        // Mobile: use alert
        Alert.alert("Missing Input", "Amount and category are required.");
      }
      return;
    }
    
    // validate that amount is positive number
    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      if (typeof window !== "undefined") {
        // Web: use browser confirm dialog
        window.alert("Invalid Amount \n\n Amount must be a positive number.");
      } else {
        // Mobile: use alert
        Alert.alert("Invalid Amount", "Amount must be a positive number.");
      }
      return;
    }
    
    // save changes
    dispatch(
      updateExpense({
        id: transactionId,
        amount: amountNumber,
        category,
        note: description,
      })
    );

    router.push("/(tabs)/transactions");
  };


  // Delete expense
  const handleDelete = () => {
    if (typeof window !== "undefined") {
      // Web: use browser confirm dialog
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        dispatch(deleteExpense(transactionId));
        router.replace("/(tabs)/transactions");
      }
    } else {
      // Mobile: use alert
      Alert.alert(
        "Delete Transaction",
        "Are you sure you want to delete this transaction?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              dispatch(deleteExpense(transactionId));
              router.replace("/(tabs)/transactions");
            },
          },
        ]
      );
    }
  };


  // View if transaction isn't loaded
  if (!transaction) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <Screen>
      <Card>

        <Text style={globalStyles.title}>Edit Transaction</Text>
        
        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        
        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={[styles.input, { backgroundColor: colors.card }]}
        >
          <Picker.Item label="Choose a category" value="" />
          {categories.map((cat: any) => (
            <Picker.Item key={cat.id} label={`${cat.icon} ${cat.name}`} value={cat.name} />
          ))}
        </Picker>
        
        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        {/* Save Changes button */}
        <PrimaryButton title="Save Changes" onPress={saveChanges} />

        {/* Delete button */}
        <PrimaryButton title="Delete Transaction" onPress={handleDelete} style={{ backgroundColor: colors.danger, marginTop: spacing.md }} />

        {/* Go Back To transactions button */}
        <PrimaryButton title="Go Back to Transactions" onPress={() => router.push("/(tabs)/transactions")} style={{ marginTop: spacing.md, backgroundColor: colors.card }} />
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
    borderColor: colors.muted,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: fontSizes.md,
    backgroundColor: colors.card,
  },
});
