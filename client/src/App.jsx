import { Route, Routes, Navigate } from "react-router-dom";
import {
  IndexPage,
  Login,
  PaymentsPayment,
  PersonalInfo,
  LoginAndSecurity,
  Signup,
  UserAccount,
  Profile,
  RegisterModal,
} from "./components/pages";
import { useAuthContext } from "./components/Hooks";
import IsProtected from "./components/Routes/IsProctected";
import Layout from "./components/Routes/Layout";
import useRegisterModal from "./components/Hooks/useRegisterModal";

function App() {
  const { user } = useAuthContext();
  const registerModal = useRegisterModal();
  return (
    <>
      {registerModal.isOpen && <RegisterModal />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to={"/"} /> : <Signup />}
          />
          <Route
            path="/user/profile"
            element={!user ? <Navigate to={"/"} /> : <Profile user={user} />}
          />
          <Route path="account" element={<IsProtected user={user} />}>
            <Route index element={<UserAccount />} />
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="login-security" element={<LoginAndSecurity />} />
            <Route path="payments" element={<PaymentsPayment />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
export default App;
