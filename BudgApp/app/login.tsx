import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../src/components/PrimaryButton";
import Screen from "../src/components/Screen";
import { loginSuccess, selectIsAuthenticated } from "../src/redux/userReducer";
import { globalStyles } from "../src/styles/globalStyles";
import { colors, fontSizes, radius, spacing } from "../src/theme/theme";

const PASSWORD_KEY = "@budgapp_password";

export default function Login() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const handleLoginPress = async () => {
    setError("");

    if (!password.trim()) {
      setError("Enter a password.");
      return;
    }

    setLoading(true);
    try {
      const storedPassword = await AsyncStorage.getItem(PASSWORD_KEY);

      if (!storedPassword) {
        await AsyncStorage.setItem(PASSWORD_KEY, password);
        dispatch(loginSuccess(username.trim() || "Guest"));
      } else if (storedPassword === password) {
        dispatch(loginSuccess(username.trim() || "Guest"));
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen centered>
      <View style={styles.card}>
        <Text style={styles.appTitle}>BudgApp</Text>
        <Text style={styles.subtitle}>Track monthly spending and goals.</Text>

        <Text style={styles.label}>Name (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colors.muted}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          title={loading ? "" : "Continue"}
          onPress={handleLoginPress}
          disabled={loading}
          style={{ marginTop: spacing.sm }}
        />
        {loading && <ActivityIndicator color={colors.info} style={{ marginTop: spacing.sm }} />}

        <Text style={styles.helper}>The password is stored only on this device.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: "100%",
  },
  appTitle: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...globalStyles.subtitle,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.cardAlt,
    color: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: fontSizes.xs,
    marginBottom: spacing.sm,
  },
  helper: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});