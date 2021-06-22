import React, { createContext, useContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
} from "use-reducer-with-side-effects";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

const AppContext = createContext();

const reducer = (prevState, action) => {
  const { type } = action;

  if (type === SET_TOKEN) {
    const { payload: jwtToken } = action;
    const newState = { ...prevState, jwtToken, isAuthenticated: true };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", jwtToken);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = { ...prevState, jwtToken: "", isAuthenticated: false };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", "");
    });
  } else if (type === SET_REFRESH_TOKEN) {
    const { payload: refreshToken } = action;
    const newState = { ...prevState, refreshToken, isAuthenticated: true };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("refreshToken", refreshToken);
    });
  } else if (type === DELETE_REFRESH_TOKEN) {
    const newState = {
      ...prevState,
      refreshToken: "",
      isAuthenticated: false,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("refreshToken", "");
    });
  }

  return prevState;
};

export const AppProvider = ({ children }) => {
  const jwtToken = getStorageItem("jwtToken", "");
  const refreshToken = getStorageItem("refreshToken", "");
  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    jwtToken,
    refreshToken,
    isAuthenticated: jwtToken.length > 0,
  });
  return (
    <AppContext.Provider value={{ store, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

// Actions
const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";
const SET_REFRESH_TOKEN = "APP/SET_REFRESH_TOKEN";
const DELETE_REFRESH_TOKEN = "APP/DELETE_REFRESH_TOKEN";

// Action Creators
export const setToken = (token) => ({ type: SET_TOKEN, payload: token });
export const deleteToken = () => ({ type: DELETE_TOKEN });

export const setRefreshToken = (token) => ({
  type: SET_REFRESH_TOKEN,
  payload: token,
});
export const deleteRefreshToken = () => ({ type: DELETE_REFRESH_TOKEN });
