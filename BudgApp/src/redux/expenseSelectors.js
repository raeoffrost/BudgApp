// src/redux/expenseSelectors.js

import { createSelector } from "@reduxjs/toolkit";

// Base selector --------------------------------------------------
export const selectExpenses = (state) => state.expenses || [];

// Get all expenses by category ----------------------------------
export const selectExpensesByCategory = (categoryId) =>
  createSelector([selectExpenses], (expenses) => {
    if (!Array.isArray(expenses)) return [];
    return expenses.filter((item) => item.category === categoryId);
  });

// Sum of a category ---------------------------------------------
export const selectCategoryTotal = (categoryId) =>
  createSelector([selectExpenses], (expenses) => {
    if (!Array.isArray(expenses)) return 0;
    return expenses
      .filter((item) => item.category === categoryId)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  });

// Monthly total (all expenses) ----------------------------------
export const selectMonthlyTotal = createSelector(
  [selectExpenses],
  (expenses) => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }
);

// New: Convert monthly total to selected currency ----------------
export const selectMonthlyTotalInCurrency = (rate) =>
  createSelector([selectMonthlyTotal], (total) => {
    if (!rate) return total;
    return total * rate;
  });
