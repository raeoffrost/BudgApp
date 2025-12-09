import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function BudgetOverview() {
  const router = useRouter();

  // Define navigation items
  const navItems = [
    { title: "Add Expense", route: "/budget/add-expense" },
    { title: "View Categories", route: "/budget/categories" },
    { title: "Goals", route: "/budget/goals" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Budget Overview</Text>
      <Text style={styles.subtitle}>
        Track your spending, goals, and categories.
      </Text>

      {navItems.map((item, index) => (
        <View
          key={item.title}
          style={[
            styles.buttonWrapper,
            index % 2 === 0 ? styles.evenButton : styles.oddButton,
          ]}
        >
          <Button
            title={item.title}
            onPress={() => router.push(item.route as any)}
            color={index % 2 === 0 ? "#58a6ff" : "#f78166"} // dynamic color
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
  },
  buttonWrapper: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  evenButton: {
    backgroundColor: "#161b22",
    padding: 5,
  },
  oddButton: {
    backgroundColor: "#21262d",
    padding: 5,
  },
});