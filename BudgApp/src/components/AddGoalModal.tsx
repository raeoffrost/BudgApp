// src/components/AddGoalModal.tsx
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
import { addGoal } from "../redux/goalReducer";
import { colors, spacing, radius, fontSizes } from "../theme/theme";
import PrimaryButton from "./PrimaryButton";

export default function AddGoalModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }
    if (!target.trim() || Number(target) <= 0) {
      setError("Target must be a positive number.");
      return;
    }
    setError("");
    dispatch(addGoal({ title, target: Number(target) }));
    setTitle("");
    setTarget("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Add New Goal</Text>
          <TextInput
            style={[styles.input, error && !title ? styles.errorBorder : {}]}
            placeholder="Goal title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, error && !target ? styles.errorBorder : {}]}
            placeholder="Target value"
            keyboardType="numeric"
            value={target}
            onChangeText={setTarget}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <PrimaryButton title="Add Goal" onPress={handleAdd} />
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
  errorBorder: { borderColor: colors.danger },
  errorText: { color: colors.danger, marginBottom: spacing.sm },
  cancel: { marginTop: spacing.sm, alignItems: "center" },
  cancelText: { color: colors.muted },
});