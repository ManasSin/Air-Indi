import { useState } from "react";
import { useAuthContext } from "./userAuth";
import axios from "axios";

export const useLogout = () => {
  const [message, setMessage] = useState("");
  const { dispatch } = useAuthContext();
  const logout = async () => {
    // const message = await axios.get("/api/user/logout");
    // setMessage(message);
    localStorage.removeItem("User");
    dispatch({ type: "LOGOUT" });
  };

  return { logout, message };
};
