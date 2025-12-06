import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fontSizes, radius, spacing } from "../theme/theme";

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>

      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  text: {
    color: "white",
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "white",
    borderRadius: radius.sm,
  },
  retryText: {
    color: colors.danger,
    fontSize: fontSizes.xs,
  },
});
