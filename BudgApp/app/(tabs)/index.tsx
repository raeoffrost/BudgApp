import React, { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useRouter } from "expo-router";
import { logout, selectIsAuthenticated, selectUsername } from "../../src/redux/userReducer";
import Screen from "../../src/components/Screen";
import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, spacing, radius, fontSizes } from "../../src/theme/theme";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const username = useSelector(selectUsername) || "there";

  const [quote, setQuote] = useState(null);
  const [quoteAuthor, setQuoteAuthor] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError("");
    try {
      const res = await fetch("https://api.quotable.io/random?tags=business|money");
      if (!res.ok) {
        throw new Error("Bad response");
      }
      const data = await res.json();
      setQuote(data.content);
      setQuoteAuthor(data.author);
    } catch {
      setQuoteError("Could not load a quote.");
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const goToCategoryDetails = () => {
    router.push({
      pathname: "/category-details",
      params: {
        categoryId: "food",
        categoryName: "Food & Dining",
        totalSpent: "430.5",
      },
    });
  };

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hi, {username}</Text>
          <Text style={styles.subGreeting}>Overview of this month&apos;s spending.</Text>
        </View>
        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </View>

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
        <Text style={styles.summaryNumber}>$1,250.00</Text>
        <Text style={styles.summarySub}>Budget: $2,000.00</Text>

        <View style={styles.summaryButtonsRow}>
          <PrimaryButton
            title="View budget"
            onPress={() => router.push("/(tabs)/budget")}
            style={styles.summaryButton}
          />
          <PrimaryButton title="Food details" onPress={goToCategoryDetails} style={styles.summaryButtonAlt} />
        </View>
      </Animated.View>

      <Card style={styles.quoteCard}>
        <View style={styles.quoteHeaderRow}>
          <Text style={globalStyles.sectionTitle}>Financial quote</Text>
          <PrimaryButton
            title="Refresh"
            onPress={fetchQuote}
            style={styles.refreshButton}
            textStyle={styles.refreshText}
          />
        </View>

        {quoteLoading && <ActivityIndicator color={colors.info} style={{ marginVertical: spacing.sm }} />}

        {quoteError ? (
          <Text style={styles.quoteError}>{quoteError}</Text>
        ) : quote ? (
          <>
            <Text style={styles.quoteText}>"{quote}"</Text>
            {quoteAuthor && <Text style={styles.quoteAuthor}>— {quoteAuthor}</Text>}
          </>
        ) : (
          !quoteLoading && <Text style={styles.quoteMuted}>No quote loaded. Use refresh to try again.</Text>
        )}
      </Card>

      <Card style={styles.linksCard}>
        <Text style={globalStyles.sectionTitle}>Navigate</Text>
        <PrimaryButton
          title="Transactions"
          onPress={() => router.push("/(tabs)/transactions")}
          style={styles.linkButton}
        />
        <PrimaryButton title="Goals" onPress={() => router.push("/(tabs)/goals")} style={styles.linkButton} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: "700",
  },
  subGreeting: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    marginTop: spacing.xs,
  },
  logoutButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.cardAlt,
  },
  logoutText: {
    fontSize: fontSizes.xs,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  summaryNumber: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: "700",
  },
  summarySub: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  summaryButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  summaryButton: {
    flex: 1,
  },
  summaryButtonAlt: {
    flex: 1,
    backgroundColor: colors.cardAlt,
  },
  quoteCard: {
    marginBottom: spacing.lg,
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
    fontSize: fontSizes.sm,
  },
  linksCard: {
    marginBottom: spacing.lg,
  },
  linkButton: {
    marginTop: spacing.sm,
  },
});
