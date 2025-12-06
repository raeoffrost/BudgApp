import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseReducer.js";
import userReducer from "./userReducer.js";

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    user: userReducer,
  },
});

export default store;
