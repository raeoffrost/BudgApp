// src/components/AddGoalTransactionModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import { addGoalTransaction } from "../redux/goalReducer";
import { colors, spacing, radius, fontSizes } from "../theme/theme";
import PrimaryButton from "./PrimaryButton";

export default function AddGoalTransactionModal({ visible, onClose, goalId }) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!amount.trim() || Number(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    setError("");
    dispatch(addGoalTransaction({ goalId, amount: Number(amount), note }));
    setAmount("");
    setNote("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Add Progress</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Note (optional)"
            value={note}
            onChangeText={setNote}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <PrimaryButton title="Add" onPress={handleAdd} />
          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.cardAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    color: colors.text,
    backgroundColor: colors.cardAlt,
  },
  errorText: { color: colors.danger, marginBottom: spacing.sm },
  cancel: { marginTop: spacing.sm, alignItems: "center" },
  cancelText: { color: colors.muted },
});