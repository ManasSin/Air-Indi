import { useState } from "react";
import { useAuthContext } from "./userAuth";
import axios from "axios";

export const userUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (id, Credentials) => {
    setIsLoading(true);
    try {
      const updateData = Credentials;
      const {
        data: { user, token },
        status,
      } = await axios.post(`/api/user/update/${id}`, {
        ...updateData,
      });
      if (status === 200 && user) {
        localStorage.setItem("User", JSON.stringify(user));
        dispatch({ type: "UPDATE_USER_DATA", payload: user });
        setError(null);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  return { updateUser, error, isLoading, setIsLoading };
};
