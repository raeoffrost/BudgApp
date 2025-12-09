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
    // Add a new expense
    addExpense: (state, action) => {
      state.push(action.payload);
    },

    // Update an existing ID
    updateExpense: (state, action) => {
      const updated = action.payload;
      const targetId = String(updated.id); 
      const index = state.findIndex((item) => String(item.id) === targetId);
      if (index !== -1) {
        state[index] = { ...state[index], ...updated }
      }
    },

    // Delete Expense by ID
    deleteExpense: (state, action) => {
      const id = action.payload;
      return state.filter((item) => String(item.id) !== id);
    },
  },
});

// Export the actions
export const { addExpense, updateExpense, deleteExpense } = expenseSlice.actions;

// Export the reducer for the store
export default expenseSlice.reducer;
