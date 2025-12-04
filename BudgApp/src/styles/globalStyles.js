import { StyleSheet } from "react-native";
import { colors, spacing, fontSizes } from "../theme/theme";

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  screenCentered: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.muted,
    fontSize: fontSizes.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
});
