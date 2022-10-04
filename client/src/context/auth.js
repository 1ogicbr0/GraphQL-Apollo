import React, { createContext, useReducer } from "react";
import jwtDecode from 'jwt-decode';

let initialState = { user: null}
if(localStorage.getItem('jwtToken')){
    const decodeToken = jwtDecode(localStorage.getItem('jwtToken'));
    if(decodeToken.exp * 1000 < Date.now){
        localStorage.removeItem('jwtToken')
    }else{
        initialState.user = decodeToken;
    }
}

export const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

const authReducer = (state, action) => {
    console.log(action)
  if (action.type === "LOGIN") {
    return { ...state, user: action.payload };
  }
  if (action.type === "LOGOUT") {
    return { ...state, user: null };
  }
  return state;
};

const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
      localStorage.setItem("jwtToken", userData.token)
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  };

  return(
      <AuthContext.Provider value={ {user: state.user, login, logout}}>{props.children}</AuthContext.Provider>
  )

};


export default AuthProvider;