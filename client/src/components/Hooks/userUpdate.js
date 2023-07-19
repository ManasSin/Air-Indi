import { useState } from "react";
import { useAuthContext } from "./userAuth";
import axios from "axios";

export const userUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    user: { _id: id },
    dispatch,
  } = useAuthContext();

  const updateUser = async (credentials) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/user/update/${id}`, credentials);
      if (data) {
        localStorage.setItem("User", JSON.stringify(data));
        dispatch({ type: "UPDATE", payload: data });
        setError(null);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError(data.error);
    }
  };

  return { updateUser, error, isLoading };
};
