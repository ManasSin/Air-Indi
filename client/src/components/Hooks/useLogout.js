import { useAuthContext } from "./userAuth";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const logout = () => {
    localStorage.removeItem("User");
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
