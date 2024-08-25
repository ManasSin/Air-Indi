import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const IsProtected = ({ user, children = null }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  });
  return children ? children : <Outlet />;
};

export default IsProtected;
