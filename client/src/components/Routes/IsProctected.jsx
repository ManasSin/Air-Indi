import { Navigate, Outlet } from "react-router-dom";

const IsProtected = ({ user, children = null }) => {
  if (user === null) {
    <Navigate to={"/"} />;
  }
  return children ? children : <Outlet />;
};

export default IsProtected;
