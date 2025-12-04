const LOGIN_SUCCESS = "user/LOGIN_SUCCESS";
const LOGOUT = "user/LOGOUT";

const initialState = {
  isAuthenticated: false,
  username: null,
};

export function loginSuccess(username) {
  return {
    type: LOGIN_SUCCESS,
    payload: { username },
  };
}

export function logout() {
  return { type: LOGOUT };
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUsername = (state) => state.user.username;
