// src/redux/budgetReducer.js
const SET_BUDGET = "SET_BUDGET";

export const setBudget = (amount) => ({
  type: SET_BUDGET,
  payload: Number(amount),
});

const initialState = {
  budget: 0,
};

export default function budgetReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BUDGET:
      return { ...state, budget: Number(action.payload) || 0 };
    default:
      return state;
  }
}