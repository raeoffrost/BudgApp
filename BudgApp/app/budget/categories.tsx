import React from "react";
import { StyleSheet, Text, View } from "react-native";

const list = ["Food", "Bills", "Shopping", "Transport", "Entertainment"];

export default function Categories() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Categories</Text>

      {list.map((item) => (
        <View key={item} style={styles.box}>
          <Text style={styles.item}>{item}</Text>
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
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  box: {
    backgroundColor: "#1f2937",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    color: "white",
    fontSize: 18,
  },
});
