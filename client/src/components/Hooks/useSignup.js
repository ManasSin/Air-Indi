import axios from "axios";
import { useAuthContext } from "./userAuth";
import { useState } from "react";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userin, setUserin] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (credentials) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/user/signup", credentials);

      if (data) {
        localStorage.setItem("User", JSON.stringify(data));
        dispatch({ type: "LOGIN", payload: data });
        setUserin(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading, userin };
};
