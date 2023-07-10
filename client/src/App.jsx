import { Route, Routes, Navigate } from "react-router-dom";
import { IndexPage, Layout, Login, Signup } from "./components/pages";
import { useAuthContext } from "./components/Hooks/userHook";

function App() {
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
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
