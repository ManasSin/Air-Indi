import { useContext } from "react";
import { UserContext } from "../Context/userContext";

export const useAuthContext = () => {
  const context = useContext(UserContext);

  if (!context)
    throw Error(
      "useAuthContext should only be used inside useAuthContextProvider"
    );

  return context;
};
