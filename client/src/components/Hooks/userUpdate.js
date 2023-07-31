import { useState } from "react";
import { useAuthContext } from "./userAuth";
import axios from "axios";

export const userUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user2, dispatch } = useAuthContext();

  const updateUser = async (credentials) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `/api/user/update/${user2?._id}`,
        credentials
      );
      if (data) {
        localStorage.setItem("User", JSON.stringify(data));
        dispatch({ type: "UPDATE_USER_DATA", payload: data });
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
