import { useState } from "react";
import { useAuthContext } from "./userAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userin, setUserin] = useState(false);
  const [error, setError] = useState(undefined);

  // const navigate = useNavigate()

  const { dispatch } = useAuthContext();

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { email, password, phone } = credentials;
      if (password !== String && password.length < 5 && !email) {
        return setError("Password must be at least 6 characters long");
      }
      const {
        data: { user, token },
      } = await axios.post("/api/user/login", {
        email,
        password,
        phone,
      });

      if (user && token) {
        localStorage.setItem("User", JSON.stringify(user));
        dispatch({ type: "LOGIN", payload: user });
        setError(null);
        setIsLoading(false);
        setUserin(true);
      }
    } catch (error) {
      setIsLoading(false);
      setError(data.error);
    }
  };

  return { login, error, isLoading, userin };
};
