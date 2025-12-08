import { useRouter, Redirect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";

import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, radius, spacing } from "../../src/theme/theme";

import ErrorBanner from "@/components/ErrorBanner";
import { fetchQuoteSafe } from "../../src/api/api";
import { selectExpenses } from "../../src/redux/expenseSelectors";
import {
  logout,
  selectIsAuthenticated,
  selectUsername,
} from "../../src/redux/userReducer";

export default function Home() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  // Redux state
  const dispatch = useDispatch();
  const username = useSelector(selectUsername) || "there";
  const expenses = useSelector(selectExpenses);
  const BUDGET = useSelector((state: any) => state.budget.budget);

  // Totals
  const totalSpent = expenses.reduce(
    (sum: number, e: any) => sum + Number(e.amount),
    0
  );

  // Quote state
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quotePercentChange, setQuotePercentChange] = useState<number>(0);

  // Dropdown state (custom, no Picker)
  const [symbol, setSymbol] = useState("AAPL");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const stockOptions = ["AAPL", "TSLA", "MSFT", "AMZN"];

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);
    setQuoteAuthor(null);

    try {
      const result = await fetchQuoteSafe(symbol);

      if (!result || !result.text) {
        throw new Error("Missing quote");
      }

      setQuote(result.text);
      setQuoteAuthor(result.author || null);

      // Safe percentChange handling
      if (typeof (result as any).percentChange === "number") {
        setQuotePercentChange((result as any).percentChange);
      } else {
        const match = String(result.text).match(/(-?\d+(\.\d+)?)\s*%/);
        setQuotePercentChange(match ? parseFloat(match[1]) : 0);
      }
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
  const numberAnim = useRef(new Animated.Value(0)).current; // animated total
  const barAnim = useRef(new Animated.Value(0)).current; // budget bar width 0..1
  const stockBarAnim = useRef(new Animated.Value(0)).current; // stock bar width mapped from percent
  const barGrowAnim = useRef(new Animated.Value(0)).current; // vertical grow for budget bar

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
        toValue: BUDGET ? Math.min(totalSpent / BUDGET, 1) : 0,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(stockBarAnim, {
        toValue: (quotePercentChange || 0) / 100, // -1..1 range potential
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(barGrowAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [totalSpent, BUDGET, quotePercentChange]);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Hi, {username}</Text>
          <Text style={styles.subHeader}>Overview of this month's spending.</Text>
        </View>

        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </View>

      {/* Summary Card */}
      <Animated.View
        style={[
          styles.summaryCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
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

        {/* Animated budget progress bar with vertical grow */}
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                transform: [
                  {
                    scaleY: barGrowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Stock performance bar */}
        <Text style={styles.summarySub}>Stock performance ({symbol})</Text>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor:
                  quotePercentChange >= 0 ? colors.primary : colors.danger,
                width: stockBarAnim.interpolate({
                  inputRange: [-0.1, 0, 0.1], // visualize -10%..+10%
                  outputRange: ["0%", "50%", "100%"],
                  extrapolate: "clamp",
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
                params: { categoryId: "food", categoryName: "Food & Dining" },
              })
            }
            style={styles.summaryButtonAlt}
          />
        </View>
      </Animated.View>

      {/* Financial Quote section */}
      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.quoteHeaderRow}>
          <Text style={globalStyles.sectionTitle}>Financial Quote</Text>
          <PrimaryButton
            title="Refresh"
            onPress={fetchQuote}
            style={styles.refreshButton}
            textStyle={styles.refreshText}
          />
        </View>

        {/* Custom dropdown (no Picker) */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityLabel="Select stock symbol"
        >
          <Text style={styles.dropdownButtonText}>{symbol}</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {stockOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownItem}
                onPress={() => {
                  setSymbol(opt);
                  setDropdownOpen(false);
                  fetchQuote();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Select ${opt}`}
              >
                <Text style={styles.dropdownItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {quoteLoading && !quoteError && (
          <ActivityIndicator
            color={colors.info}
            style={{ marginVertical: spacing.sm }}
          />
        )}

        <ErrorBanner message={quoteError || ""} onRetry={fetchQuote} />

        {!quoteLoading && !quoteError && quote && (
          <>
            <Text style={styles.quoteText}>{quote}</Text>
            {quoteAuthor && <Text style={styles.quoteAuthor}>— {quoteAuthor}</Text>}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  logoutButton: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  logoutText: {
    fontSize: fontSizes.xs,
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

  // Custom dropdown styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: colors.cardAlt,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    alignSelf: "flex-start",
  },
  dropdownButtonText: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  dropdownList: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.cardAlt,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardAlt,
  },
  dropdownItemText: {
    color: colors.text,
    fontSize: fontSizes.sm,
  },

  quoteText: {
    color: colors.text,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  quoteAuthor: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  quoteMuted: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    marginTop: spacing.sm,
  },
  quoteError: {
    color: colors.danger,
    marginTop: spacing.sm,
  },

  linkButton: {
    marginTop: spacing.sm,
  },
});