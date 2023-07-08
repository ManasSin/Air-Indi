import { Route, Routes, Navigate } from "react-router-dom";
import { IndexPage, Layout, Login, Signup } from "./components/pages";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:4000";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
