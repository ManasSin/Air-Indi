import { Route, Routes, Navigate } from "react-router-dom";
import { IndexPage, Layout, Login, Signup } from "./components/pages";
import { useAuthContext } from "./components/Hooks/userHook";
import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    axios.get("/api/user/profile");
  }, []);

  const { user } = useAuthContext();
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to={"/"} /> : <Login />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
