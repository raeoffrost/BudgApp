import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseReducer.js";
import budgetReducer from "./budgetReducer.js";
import userReducer from "./userReducer.js";
import APIreducer from "./APIreducer.js";
import goalReducer from "./goalReducer.js";
import categoryReducer from "./categoryReducer.js"

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    budget: budgetReducer,
    user: userReducer,
    api: APIreducer,
    goals:goalReducer,
    categories: categoryReducer,
  },
});

export default store;
