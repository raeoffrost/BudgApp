// src/redux/APIreducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: "USD",
  rate: 1,
  convertedBudget: 0,
  quote: null,
  quoteAuthor: null,
  quotePercentChange: 0,
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
    setConversion: (state, action) => {
      state.convertedBudget = action.payload;
    },
    setQuote: (state, action) => {
      const { text, author, percentChange } = action.payload;
      state.quote = text ?? null;
      state.quoteAuthor = author ?? null;
      state.quotePercentChange = percentChange ?? 0;
    },
  },
});

export const { setCurrency, setRate, setConversion, setQuote } = apiSlice.actions;
export default apiSlice.reducer;