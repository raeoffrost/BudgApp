import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeGoal } from "../../src/redux/goalReducer";
import AddGoalModal from "../../src/components/AddGoalModal";
import AddGoalTransactionModal from "../../src/components/AddGoalTransactionModal";
import ProgressBar from "../../src/components/ProgressBar";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import { colors, spacing, fontSizes, radius } from "../../src/theme/theme";

export default function GoalScreen() {
  const goals = useSelector((state: any) => state.goals.goals);
  const transactions = useSelector(
    (state: any) => state.goals.goalTransactions
  );
  const dispatch = useDispatch();

  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [txModalGoalId, setTxModalGoalId] = useState<number | null>(null);

  // Stable memo to avoid unnecessary re-renders but ensure updates on changes
  const txByGoal = useMemo(() => {
    const map: Record<number, any[]> = {};
    for (const tx of transactions) {
      const gid = Number(tx.goalId);
      if (!map[gid]) map[gid] = [];
      map[gid].push(tx);
    }
    return map;
  }, [transactions]);

  const renderGoal = ({ item }: { item: any }) => {
    const progress = Number(item.progress) || 0;
    const target = Number(item.target) || 0;
    const progressPct =
      target > 0 ? Math.min((progress / target) * 100, 100) : 0;

    const goalTxs = txByGoal[item.id] || [];

    return (
      <Card style={styles.goalCard}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <Text style={styles.goalProgress}>
          Progress: {progress}/{target} ({Math.round(progressPct)}%)
        </Text>

        <ProgressBar progress={progressPct} />

        <PrimaryButton
          title="Add progress"
          onPress={() => setTxModalGoalId(item.id)}
          style={{ marginVertical: spacing.sm }}
        />

        <Pressable onPress={() => dispatch(removeGoal(item.id))}>
          <Text style={styles.remove}>Remove goal</Text>
        </Pressable>

        {goalTxs.length > 0 && (
          <View style={{ marginTop: spacing.sm }}>
            <Text style={styles.txHeader}>Transactions:</Text>
            {goalTxs.map((tx: any) => (
              <View key={tx.id} style={styles.txRow}>
                <Text style={styles.txItem}>
                  +{Number(tx.amount)} ({tx.note || "No note"})
                </Text>
                <Text style={styles.txDate}>
                  {new Date(tx.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    );
  };

  const listHeader = (
    <Card style={{ marginBottom: spacing.md }}>
      <Text style={styles.header}>Goals</Text>
      <PrimaryButton
        title="Add goal"
        onPress={() => setGoalModalVisible(true)}
        style={{ marginTop: spacing.sm }}
      />
    </Card>
  );

  return (
    <Screen>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGoal}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Text style={styles.empty}>No goals yet. Add one!</Text>
        }
        extraData={transactions}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
      />

      <AddGoalModal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
      />

      <AddGoalTransactionModal
        visible={txModalGoalId !== null}
        onClose={() => setTxModalGoalId(null)}
        goalId={txModalGoalId as number}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    color: colors.text,
  },
  goalCard: {
    marginBottom: spacing.md,
    borderRadius: radius.md,
  },
  goalTitle: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: colors.text,
  },
  goalProgress: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  remove: { color: colors.danger, fontSize: fontSizes.sm, marginTop: spacing.sm },
  empty: { color: colors.muted, textAlign: "center", marginTop: spacing.lg },
  txHeader: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    marginTop: spacing.sm,
    color: colors.text,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  txItem: { fontSize: fontSizes.xs, color: colors.text },
  txDate: { fontSize: fontSizes.xs, color: colors.muted },
});