import { useState } from "react";
import { useAuthContext } from "./userAuth";
import axios from "axios";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userin, setUserin] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch } = useAuthContext();

  const login = async (credentials) => {
    setIsLoading(true);
    const { data } = await axios.post("/api/user/login", credentials);

    if (data) {
      localStorage.setItem("User", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });
      setError(null);
      setIsLoading(false);
      setUserin(true);
    }

    if (!data) {
      setIsLoading(false);
      setError(data.error);
    }
  };

  return { login, error, isLoading, userin };
};
