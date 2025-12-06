import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../src/components/PrimaryButton";
import { colors, fontSizes, radius, spacing } from "../../src/theme/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  totalSpent: number;
  budget: number;
};

export default function OverBudgetModal({ visible, onClose, totalSpent, budget }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>⚠️ Over Budget!</Text>
          <Text style={styles.message}>
            You’ve spent ${totalSpent.toFixed(2)} which is above your budget of ${budget.toFixed(2)}.
          </Text>

          <PrimaryButton
            title="Review Budget"
            onPress={onClose}
            style={styles.button}
          />
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
    alignItems: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: "100%",
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
    color: colors.danger,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.sm,
  },
});