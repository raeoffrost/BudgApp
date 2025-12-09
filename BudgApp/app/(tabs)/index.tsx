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
import { setQuote } from "../../src/redux/APIreducer";

export default function Home() {
  
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const username = useSelector(selectUsername) || "there";
  const expenses = useSelector(selectExpenses);
  const BUDGET = useSelector((state: any) => state.budget.budget);

  const quote = useSelector((state: any) => state.api.quote);
  const quoteAuthor = useSelector((state: any) => state.api.quoteAuthor);
  const quotePercentChange =
    useSelector((state: any) => state.api.quotePercentChange) ?? 0;

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const stockOptions = ["AAPL", "TSLA", "MSFT", "AMZN"];
  const [symbol, setSymbol] = useState("AAPL");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const budgetBarAnim = useRef(new Animated.Value(0)).current;
  const stockBarAnim = useRef(new Animated.Value(0)).current;
  const barGrowAnim = useRef(new Animated.Value(0)).current;

  const totalSpent = expenses.reduce(
    (sum: number, e: any) => sum + Number(e.amount),
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  const fetchAndStoreQuote = async (ticker: string) => {
    setQuoteLoading(true);
    setQuoteError(null);

    try {
      const result = await fetchQuoteSafe(ticker);
      if (!result || !result.text) throw new Error("Missing quote text");

      let percent = 0;
      if (typeof (result as any).percentChange === "number") {
        percent = (result as any).percentChange;
      } else {
        const match = String(result.text).match(/(-?\d+(\.\d+)?)\s*%/);
        percent = match ? parseFloat(match[1]) : 0;
      }

      dispatch(
        setQuote({
          text: result.text,
          author: result.author || ticker,
          percentChange: Number.isFinite(percent) ? percent : 0,
        })
      );
    } catch (err) {
      console.log("Quote error:", err);
      setQuoteError("Could not load a quote.");
      dispatch(setQuote({ text: null, author: null, percentChange: 0 }));
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchAndStoreQuote(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

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
      Animated.timing(budgetBarAnim, {
        toValue: BUDGET ? Math.min(totalSpent / BUDGET, 1) : 0,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(stockBarAnim, {
        toValue: (quotePercentChange || 0) / 100,
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
      {/* Header */}
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
        <Animated.Text style={styles.summaryNumber}>
          {numberAnim.interpolate({
            inputRange: [0, totalSpent],
            outputRange: ["0", totalSpent.toFixed(0)],
          })}
        </Animated.Text>
        <Text style={styles.summarySub}>Budget: ${BUDGET.toFixed(2)}</Text>

        {/* Budget progress bar */}
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: budgetBarAnim.interpolate({
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
        <Text style={styles.summarySub}>Stock Performance ({symbol})</Text>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor:
                  (quotePercentChange || 0) >= 0 ? colors.primary : colors.danger,
                width: stockBarAnim.interpolate({
                  inputRange: [-0.1, 0, 0.1],
                  outputRange: ["0%", "50%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* Financial Quote section */}
      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.quoteHeaderRow}>
          <Text style={globalStyles.sectionTitle}>Financial Quote</Text>
          <PrimaryButton
            title="Refresh"
            onPress={() => fetchAndStoreQuote(symbol)}
            style={styles.refreshButton}
            textStyle={styles.refreshText}
          />
        </View>

      
<TouchableOpacity
  style={styles.dropdownButton}
  onPress={() => setDropdownOpen((o) => !o)}
>
  <Text style={styles.dropdownButtonText}>
    {symbol || "Select a stock"}
  </Text>
</TouchableOpacity>

{dropdownOpen && (
  <View style={styles.dropdownList}>
    {stockOptions.map((opt) => (
      <TouchableOpacity
        key={opt}
        style={styles.dropdownItem}
        onPress={() => {
          setSymbol(opt);       // opt is always a string
          setDropdownOpen(false);
        }}
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

<ErrorBanner
  message={quoteError || ""}
  onRetry={() => fetchAndStoreQuote(symbol)}
/>

{!quoteLoading && !quoteError && quote && (
  <View style={{ marginTop: spacing.sm }}>
    {/* Split the quote into parts if you want more control */}
    <Text style={styles.quoteText}>
      {quote}
    </Text>
    <Text style={styles.quoteAuthor}>
      — {quoteAuthor || symbol}
    </Text>
  </View>
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
  // Header
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

  // Summary card
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

  // Progress bars
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

  // Buttons row
  summaryButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  summaryButton: { flex: 1 },
  summaryButtonAlt: {
    flex: 1,
    backgroundColor: colors.cardAlt,
  },

  // Quote section
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

  // Quote text
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

  // Links
  linkButton: {
    marginTop: spacing.sm,
  },
});