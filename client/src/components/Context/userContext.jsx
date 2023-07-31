import { createContext, useEffect, useReducer } from "react";

export const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_USER_DATA":
      return { user: action.payload };
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    modalState: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    // console.log(user);

    if (user && user.user) {
      const { user: userData } = user;
      dispatch({ type: "LOGIN", payload: userData });
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
