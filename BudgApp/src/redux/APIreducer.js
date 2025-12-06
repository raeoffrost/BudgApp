// src/redux/APIreducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: "USD",       // default currency
  rate: 1,               // exchange rate relative to USD
  convertedBudget: 0,    // optional legacy field
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setRate: (state, action) => {
      state.rate = action.payload;
    },
    // keep for backward compatibility if you want to set a precomputed converted budget
    setConversion: (state, action) => {
      state.convertedBudget = action.payload;
    },
  },
});

export const { setCurrency, setRate, setConversion } = apiSlice.actions;
export default apiSlice.reducer;