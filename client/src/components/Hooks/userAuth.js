import { useContext } from "react";
import { UserContext } from "../Context/userContext";

export const useAuthContext = () => {
  const context = useContext(UserContext);

  if (!context)
    throw Error(
      "an error has occurred. please make sure you have a UserContextProvider"
    );

  return context;
};
