import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../src/components/Card";
import PrimaryButton from "../../src/components/PrimaryButton";
import Screen from "../../src/components/Screen";
import OverBudgetModal from "../../src/components/OverBudgetModal";
import ProgressBar from "../../src/components/ProgressBar";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSizes, spacing, radius } from "../../src/theme/theme";

import { setBudget } from "../../src/redux/budgetReducer";
import { setCurrency, setRate } from "../../src/redux/APIreducer";


const CURRENCIES = ["USD", "CAD", "EUR", "GBP"];

export default function Budget() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state
  const budget = useSelector((state: any) => state.budget.budget);
  const expenses = useSelector((state: any) => state.expenses);
  const currency = useSelector((state: any) => state.api.currency);
  const rate = useSelector((state: any) => state.api.rate);

  // Local state
  const [inputValue, setInputValue] = useState(String(Number(budget) || 0));
  const [showOverBudget, setShowOverBudget] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Totals (USD source-of-truth)
  const totalSpent = expenses.reduce(
    (sum: number, e: any) => sum + Number(e?.amount || 0),
    0
  );
  const numericBudget = Number(budget) || 0;
  const spentPct = numericBudget > 0 ? Math.min((totalSpent / numericBudget)* 100, 100): 0;
  const remaining = numericBudget - totalSpent;

  // Converted values (derived from rate)
  const safeRate = Number(rate) || 1;
  const budgetInCCY = numericBudget * safeRate;
  const spentInCCY = totalSpent * safeRate;
  const remainingInCCY = remaining * safeRate;

  const handleSaveBudget = () => {
    const parsed = Number(inputValue);

    if (!inputValue.trim()) {
      setErrorMessage("Please enter a budget amount before saving.");
      return;
    }

    if (Number.isNaN(parsed) || parsed <= 0) {
      setErrorMessage("Budget must be a positive number.");
      return;
    }

    // Clear error if valid
    setErrorMessage("");
    dispatch(setBudget(parsed));
  };

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchRate = async () => {
      const ccy = (currency || "USD").toUpperCase();

      if (ccy === "USD") {
        dispatch(setRate(1));
        return;
      }

      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=USD&to=${ccy}`
        );
        const data = await res.json();
        const rateValue = Number(data?.rates?.[ccy]);

        if (!rateValue || Number.isNaN(rateValue)) {
          dispatch(setRate(1));
        } else {
          dispatch(setRate(rateValue));
        }
      } catch (err) {
        console.error("Rate fetch failed:", err);
        dispatch(setRate(1));
      }
    };

    fetchRate();
  }, [currency, dispatch]);

  useEffect(() => {
    setShowOverBudget(remaining < 0);
  }, [remaining]);

  const openDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);
  const selectCurrency = (c: string) => {
    dispatch(setCurrency(c));
    closeDropdown();
  };

  return (
    <Screen scroll>
      <Card>
        <Text style={globalStyles.title}>Budget</Text>

        <Text style={styles.label}>Set Monthly Budget (USD):</Text>
        <TextInput
          style={[
            styles.input,
            errorMessage ? { borderColor: colors.danger } : {},
          ]}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter amount"
          placeholderTextColor={colors.muted}
        />

        <PrimaryButton
          title="Save Budget"
          onPress={handleSaveBudget}
          style={{ marginTop: spacing.md }}
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Choose currency:</Text>
        <Pressable onPress={openDropdown} style={styles.dropdownTrigger}>
          <Text style={styles.dropdownText}>{currency}</Text>
          <Text style={styles.dropdownChevron}>▾</Text>
        </Pressable>

        <View style={{ marginTop: spacing.lg }}>
          <Text style={styles.summary}>
            Budget (USD): ${numericBudget.toFixed(2)}
          </Text>
          <Text style={styles.summary}>
            Budget ({currency}): {budgetInCCY.toFixed(2)} {currency}
          </Text>

          <Text style={styles.summary}>
            Spent (USD): ${totalSpent.toFixed(2)}
          </Text>
          <Text style={styles.summary}>
            Spent ({currency}): {spentInCCY.toFixed(2)} {currency}
          </Text>

          <Text
            style={[
              styles.summary,
              remaining < 0 ? styles.overBudget : styles.remaining,
            ]}
          >
            Remaining (USD): ${remaining.toFixed(2)}
          </Text>


          <Text
            style={[
              styles.summary,
              remaining < 0 ? styles.overBudget : styles.remaining,
            ]}
          >
            Remaining ({currency}): {remainingInCCY.toFixed(2)} {currency}
          </Text>
          {/* Progress bar showing % spent */}
          <ProgressBar progress={spentPct} />
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={globalStyles.title}>Transactions</Text>
        {expenses.length === 0 ? (
          <Text style={styles.empty}>No expenses yet. Add one!</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={styles.itemText}>
                  <Text style={styles.amount}>${Number(item.amount).toFixed(2)}</Text>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.note}>{item.note || "No note"}</Text>
                </View>
              </View>
            )}
          />
        )}
        <PrimaryButton
          title="Add New Expense"
          onPress={() => router.push("/add-expense")}
          style={{ marginTop: spacing.lg }}
        />
      </Card>

      <OverBudgetModal
        visible={showOverBudget}
        onClose={() => setShowOverBudget(false)}
        totalSpent={totalSpent}
        budget={numericBudget}
      />

      {/* Error Modal */}
      <Modal
        transparent
        visible={!!errorMessage}
        animationType="fade"
        onRequestClose={() => setErrorMessage("")}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setErrorMessage("")}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Budget error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <PrimaryButton title="OK" onPress={() => setErrorMessage("")} />
          </View>
        </Pressable>
      </Modal>

      {/* Dropdown modal */}
      <Modal
        transparent
        visible={dropdownOpen}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDropdown}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select currency</Text>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selectCurrency(item)}
                  style={[
                    styles.optionRow,
                    item === currency && styles.optionRowActive,
                  ]}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.text, fontSize: fontSizes.sm, marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.cardAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
    color: colors.text,
    backgroundColor: colors.cardAlt,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSizes.sm,
    marginTop: spacing.sm,
    fontWeight: "600",
  },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.cardAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardAlt,
  },
  dropdownText: { color: colors.text, fontSize: fontSizes.md },
  dropdownChevron: { color: colors.muted, fontSize: fontSizes.md },
  summary: { fontSize: fontSizes.md, color: colors.text, marginBottom: spacing.sm },
  remaining: { color: colors.primary, fontWeight: "600" },
  overBudget: { color: colors.danger, fontWeight: "700" },
  empty: { color: colors.muted, fontSize: fontSizes.sm, marginTop: spacing.md },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardAlt,
  },
  itemText: { flex: 1 },
  amount: { color: colors.primary, fontSize: fontSizes.md, fontWeight: "600" },
  category: { color: colors.text, fontSize: fontSizes.sm },
  note: { color: colors.muted, fontSize: fontSizes.xs },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "700",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  modalMessage: {
    color: colors.text,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  optionRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  optionRowActive: { backgroundColor: colors.cardAlt },
  optionText: { color: colors.text, fontSize: fontSizes.md },
});