import { useContext } from "react";
import { userContext } from "../Context/userContext";

export const useAuthContext = () => {
  const context = useContext(userContext);

  if (!context)
    throw Error(
      "useAuthContext should only be used inside useAuthContextProvider"
    );

  return context;
};
