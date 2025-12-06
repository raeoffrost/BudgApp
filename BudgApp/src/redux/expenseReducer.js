import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  // Example structure:
  // {
  //   id: "tx1",
  //   amount: 50,
  //   category: "food",
  //   note: "Pizza",
  //   date: "2025-01-10",
  // }
];

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    // ---- Add a new expense ----
    addExpense: (state, action) => {
      state.push(action.payload);
    },

    // ---- Update an existing expense by ID ----
    updateExpense: (state, action) => {
      const updated = action.payload;
      const index = state.findIndex((item) => item.id === updated.id);
      if (index !== -1) {
        state[index] = updated;
      }
    },

    // ---- Delete an expense by ID (Step 1) ----
    deleteExpense: (state, action) => {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
  },
});

// Export the actions
export const { addExpense, updateExpense, deleteExpense } = expenseSlice.actions;

// Export the reducer for the store
export default expenseSlice.reducer;
