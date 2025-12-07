import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";

import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, radius, spacing } from "../../src/theme/theme";

import { selectExpenses } from "../../src/redux/expenseSelectors";
import { fetchQuoteSafe } from "../../src/api/api";
import ErrorBanner from "../../components/ErrorBanner";

export default function Home() {
  const router = useRouter();

  // Get expenses from Redux
  const expenses = useSelector(selectExpenses);

  // Get budget from Redux
  const BUDGET = useSelector((state: any) => state.budget.budget)

  // Calculate total spent
 const totalSpent = expenses.reduce(
  (sum: number, e: any) => sum + Number(e.amount),
  0
);

  // Quote state
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);
    setQuoteAuthor(null);

    try {
      const result = await fetchQuoteSafe();

      if (!result || !result.text) {
        throw new Error("Missing quote");
      }

      setQuote(result.text);
      setQuoteAuthor(result.author || null);
    } catch (error) {
      console.log("Quote error:", error);
      setQuoteError("Could not load a quote.");
    } finally {
      setQuoteLoading(false);
    }
  };

  // Load quote on first mount
  useEffect(() => {
    fetchQuote();
  }, []);


  // --- Animations ---
  const fadeAnim = useRef(new Animated.Value(0)).current; // fade in
  const slideAnim = useRef(new Animated.Value(20)).current; // slide up
  const numberAnim = useRef(new Animated.Value(0)).current; // number counter
  const barAnim = useRef(new Animated.Value(0)).current; // progress bar

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(numberAnim, {
        toValue: totalSpent,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(barAnim, {
        toValue: totalSpent / BUDGET,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [totalSpent]);

  return (
    <Screen scroll>
      {/* Header */}
      <Text style={styles.header}>Hi, Team!</Text>
      <Text style={styles.subHeader}>Overview of this month's spending.</Text>

      {/* Summary Card */}
      <Animated.View
        style={[
          styles.summaryCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.summaryLabel}>This month</Text>

        {/* Animated number */}
        <Animated.Text style={styles.summaryNumber}>
          {numberAnim.interpolate({
            inputRange: [0, totalSpent],
            outputRange: ["0", totalSpent.toFixed(0)],
          })}
        </Animated.Text>

        <Text style={styles.summarySub}>Budget: ${BUDGET.toFixed(2)}</Text>

        {/* Animated progress bar */}
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        {/* Buttons */}
        <View style={styles.summaryButtonsRow}>
          <PrimaryButton
            title="View budget"
            onPress={() => router.push("/(tabs)/budget")}
            style={styles.summaryButton}
          />
          <PrimaryButton
            title="Food details"
            onPress={() =>
              router.push({
                pathname: "/category-details",
                params: {
                  categoryId: "food",
                  categoryName: "Food & Dining",
                },
              })
            }
            style={styles.summaryButtonAlt}
          />
        </View>
      </Animated.View>

            {/* Quote section */}
      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.quoteHeaderRow}>
          <Text style={globalStyles.sectionTitle}>Your inspiration for today!</Text>
          <PrimaryButton
            title="Refresh"
            onPress={fetchQuote}
            style={styles.refreshButton}
            textStyle={styles.refreshText}
          />
        </View>

        {quoteLoading && !quoteError && (
          <ActivityIndicator
            color={colors.info}
            style={{ marginVertical: spacing.sm }}
          />
        )}

        {/* Error banner with Retry */}
        <ErrorBanner message={quoteError || ""} onRetry={fetchQuote} />

        {/* Normal quote / empty states (only when no error) */}
        {!quoteLoading && !quoteError && quote && (
          <>
            <Text style={styles.quoteText}>"{quote}"</Text>
            {quoteAuthor && (
              <Text style={styles.quoteAuthor}>— {quoteAuthor}</Text>
            )}
          </>
        )}

        {!quoteLoading && !quoteError && !quote && (
          <Text style={styles.quoteMuted}>
            No quote loaded. Use refresh to try again.
          </Text>
        )}
      </Card>


      {/* Navigation */}
      <Card style={{ marginTop: spacing.lg }}>
        <Text style={globalStyles.sectionTitle}>Navigate</Text>

        <PrimaryButton
          title="Transactions"
          onPress={() => router.push("/transactions")}
          style={styles.linkButton}
        />

        <PrimaryButton
          title="Goals"
          onPress={() => router.push("/goals")}
          style={styles.linkButton}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: "700",
    marginTop: spacing.lg,
  },
  subHeader: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: fontSizes.sm,
  },
  summaryNumber: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "700",
    marginVertical: spacing.sm,
  },
  summarySub: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginBottom: spacing.md,
  },
  progressBackground: {
    height: 10,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  summaryButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  summaryButton: { flex: 1 },
  summaryButtonAlt: {
    flex: 1,
    backgroundColor: colors.cardAlt,
  },
  quoteHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  refreshButton: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  refreshText: {
    fontSize: fontSizes.xs,
  },
  quoteText: {
    color: colors.text,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  quoteAuthor: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: spacing.sm,
  },
  quoteMuted: {
    color: colors.muted,
    fontSize: fontSizes.sm,
  },
  quoteError: {
    color: colors.danger,
    marginTop: spacing.sm,
  },
  linkButton: {
    marginTop: spacing.sm,
  },
});

