import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import { deleteExpense, updateExpense } from "../../src/redux/expenseReducer";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, spacing } from "../../src/theme/theme";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { selectCategories } from "../../src/redux/categoryReducer";

export default function EditTransaction() {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories) || [];

  const params = useLocalSearchParams();

  // --- Fix string | string[] error ---
  const transactionId = Array.isArray(params.transactionId)
    ? params.transactionId[0]
    : params.transactionId || "";

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    setAmount(
      Array.isArray(params.initialAmount)
        ? params.initialAmount[0]
        : params.initialAmount || ""
    );

    setCategory(
      Array.isArray(params.initialCategory)
        ? params.initialCategory[0]
        : params.initialCategory || ""
    );

    setDescription(
      Array.isArray(params.initialDescription)
        ? params.initialDescription[0]
        : params.initialDescription || ""
    );


  }, [params.transactionId]);

  // --- Update Transaction ---
  const saveChanges = () => {
    if (!amount || !category) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

  dispatch(
    updateExpense({
      id: transactionId,
      amount: Number(amount),
      category,
      note: description, 
    })
    );

    router.replace("/transactions");
  };

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

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />

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

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
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
    borderColor: colors.muted,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: fontSizes.md,
    backgroundColor: colors.card,
  },
});
