import { Navigate, Outlet } from "react-router-dom";

const IsProtected = ({ userIn, children = null }) => {
  if (userIn === null) {
    return <Navigate to={"/"} />;
  }
  return children ? children : <Outlet />;
};

export default IsProtected;
