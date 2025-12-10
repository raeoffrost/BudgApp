// src/redux/goalReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goals: [], // { id, title, progress, target, completed, congratsShown }
  goalTransactions: [], // { id, goalId, amount, note, date }
};

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    addGoal: (state, action) => {
      const { title, target } = action.payload;
      state.goals.push({
        id: Date.now(),
        title,
        progress: 0,
        target: Number(target),
        completed: false,
        congratsShown: false,
      });
    },
    addGoalTransaction: (state, action) => {
      const { goalId, amount, note } = action.payload;
      const amt = Number(amount);
      const tx = {
        id: Date.now(),
        goalId,
        amount: amt,
        note,
        date: new Date().toISOString(),
      };
      state.goalTransactions.push(tx);

      const goal = state.goals.find((g) => g.id === goalId);
      if (goal) {
        goal.progress = Math.max(0, Number(goal.progress) + amt);

        // Mark as completed if target reached and not already flagged
        if (goal.progress >= goal.target && !goal.completed) {
          goal.completed = true;
        }
      }
    },
    removeGoal: (state, action) => {
      const goalId = action.payload;
      state.goals = state.goals.filter((g) => g.id !== goalId);
      state.goalTransactions = state.goalTransactions.filter(
        (tx) => tx.goalId !== goalId
      );
    },
    markGoalCongratsShown: (state, action) => {
      const goalId = action.payload;
      const goal = state.goals.find((g) => g.id === goalId);
      if (goal) {
        goal.congratsShown = true;
      }
    },
  },
});

export const {
  addGoal,
  addGoalTransaction,
  removeGoal,
  markGoalCongratsShown,
} = goalSlice.actions;
export default goalSlice.reducer;