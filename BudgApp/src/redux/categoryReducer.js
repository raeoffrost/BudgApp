import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    { id: "food", name: "Food", icon: "🍔" },
    { id: "travel", name: "Travel", icon: "✈️" },
    { id: "shopping", name: "Shopping", icon: "🛍️" },
  ],
  selectedCategory: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { selectCategory } = categorySlice.actions;

export const selectCategories = (state) => state.categories.categories;
export const selectSelectedCategory = (state) => state.categories.selectedCategory;

export default categorySlice.reducer;
